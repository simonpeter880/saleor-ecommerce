# TODO Tracker & Technical Debt

This document tracks all TODOs, FIXMEs, and technical debt items found in the codebase.

**Last Updated:** January 9, 2026
**Status:** Initial assessment completed

---

## 🚨 Priority Classification

- **P0 (Critical)**: Security issues, data corruption risks, blocking production deployments
- **P1 (High)**: Performance issues, user-facing bugs, incomplete critical features
- **P2 (Medium)**: Code quality, optimization opportunities, missing validations
- **P3 (Low)**: Refactoring, documentation, test improvements

---

## Backend TODOs

### 📊 Database & Performance (P2)

#### 1. Database Replica Configuration
**File:** [saleor/saleor/settings.py:118-141](saleor/saleor/settings.py#L118-L141)

**Current Status:** Planned for future PR

**TODO Items:**
```python
# TODO: For local envs will be activated in separate PR.
# We need to update docs an saleor platform.
# This variable should be set to `replica`
DATABASE_CONNECTION_REPLICA_NAME = "replica"

# TODO: We need to add read only user to saleor platform,
# and we need to update docs.
# default="postgres://saleor_read_only:saleor@localhost:5432/saleor",
```

**Priority:** P2 - Medium
**Impact:** Performance optimization for read-heavy operations
**Estimated Effort:** 2-3 days (requires infrastructure setup + documentation)

**Next Steps:**
1. Set up read-only database user
2. Configure read replica in production
3. Update deployment documentation
4. Add environment variable `DATABASE_URL_REPLICA`
5. Test replica lag monitoring

**Recommendation:** Implement when traffic reaches 1000+ req/min on read operations

---

### 💳 Payment System (P2-P3)

#### 2. Currency Validation
**File:** [saleor/saleor/payment/models.py:300](saleor/saleor/payment/models.py#L300)

**TODO:**
```python
currency = models.CharField(
    max_length=settings.DEFAULT_CURRENCY_CODE_LENGTH
)  # FIXME: add ISO4217 validator
```

**Priority:** P2 - Medium
**Impact:** Data integrity for currency codes
**Estimated Effort:** 2-4 hours

**Solution:**
```python
from django.core.validators import RegexValidator

iso4217_validator = RegexValidator(
    regex=r'^[A-Z]{3}$',
    message='Currency must be a valid ISO 4217 code (e.g., USD, EUR, GBP)'
)

currency = models.CharField(
    max_length=settings.DEFAULT_CURRENCY_CODE_LENGTH,
    validators=[iso4217_validator]
)
```

**Additional Consideration:** Consider using `pycountry` library for comprehensive ISO 4217 validation.

---

#### 3. Payment Save Verification
**File:** [saleor/saleor/payment/utils.py:573](saleor/saleor/payment/utils.py#L573)

**TODO:**
```python
if not transaction.is_success or transaction.already_processed:
    if changed_fields:
        # FIXME: verify that we actually want to save the payment here
        # as with empty changed_fields it won't be saved
        payment.save(update_fields=changed_fields)
```

**Priority:** P2 - Medium
**Impact:** Payment state consistency
**Estimated Effort:** 4-6 hours (requires thorough testing)

**Analysis Needed:**
- Review payment workflow to determine if saving is necessary
- Check for potential race conditions
- Verify idempotency guarantees
- Add comprehensive tests for all payment states

---

#### 4. Transaction Status Enhancement
**File:** [saleor/saleor/payment/__init__.py:77](saleor/saleor/payment/__init__.py#L77)

**TODO:**
```python
CONFIRM = "confirm"
CANCEL = "cancel"
# FIXME we could use another status like WAITING_FOR_AUTH for transactions
# Which were authorized, but needs to be confirmed manually by staff
# eg. Braintree with "submit_for_settlement" enabled
```

**Priority:** P3 - Low
**Impact:** Improved payment workflow tracking
**Estimated Effort:** 1-2 days

**Recommendation:**
- Add `WAITING_FOR_CONFIRMATION` status
- Update payment gateway integrations (Braintree, Adyen)
- Add admin UI for manual confirmation
- Document new workflow in payment docs

---

#### 5. Multiple Payments Support
**File:** [saleor/saleor/payment/model_helpers.py:21](saleor/saleor/payment/model_helpers.py#L21)

**TODO:**
```python
def get_total_authorized(payments: Iterable[Payment], fallback_currency: str):
    # FIXME adjust to multiple payments in the future
    if last_payment := get_last_payment(payments):
```

**Priority:** P2 - Medium
**Impact:** Support for split payments, gift cards + credit card, etc.
**Estimated Effort:** 1-2 weeks

**Use Cases:**
- Split payment across multiple cards
- Gift card + credit card combination
- Partial refunds to different payment methods
- Buy now, pay later integrations

**Breaking Change:** Yes - requires API changes

---

### 🧪 Testing (P3)

#### 6. Braintree Test Mock
**File:** [saleor/saleor/payment/gateways/braintree/tests/test_braintree.py:41](saleor/saleor/payment/gateways/braintree/tests/test_braintree.py#L41)

**TODO:**
```python
credit_card="",  # FIXME we should provide a proper CreditCard mock
```

**Priority:** P3 - Low
**Impact:** Test coverage improvement
**Estimated Effort:** 1-2 hours

**Solution:** Create comprehensive CreditCard mock object with all required attributes.

---

## Frontend TODOs

### ⭐ Product Reviews System (P1)

**Files:**
- [storefront/src/app/api/reviews/[productId]/route.ts](storefront/src/app/api/reviews/[productId]/route.ts)
- [storefront/src/app/api/reviews/[productId]/[reviewId]/helpful/route.ts](storefront/src/app/api/reviews/[productId]/[reviewId]/helpful/route.ts)
- [storefront/src/app/api/reviews/[productId]/statistics/route.ts](storefront/src/app/api/reviews/[productId]/statistics/route.ts)

**Current Status:** API routes stubbed, needs database integration

#### 7. Database Integration for Reviews
**Priority:** P1 - High
**Impact:** Critical feature for e-commerce (social proof, SEO)
**Estimated Effort:** 3-5 days

**TODOs:**
1. ✅ Replace mock data with actual database queries
2. ✅ Implement email validation
3. ✅ Add verified purchase checking
4. ✅ Create review moderation system
5. ✅ Send admin notifications for new reviews
6. ✅ Add review statistics aggregation
7. ✅ Implement helpful/not helpful voting
8. ✅ Add spam detection

**Specific Items:**

##### 7a. Database Schema Setup
```typescript
// TODO: Replace with actual database query (line 46)
// Need Prisma schema or GraphQL integration with Saleor
```

**Recommendation:** Use Saleor's existing review system or create custom tables:
- `product_reviews`
- `review_votes` (helpful/not helpful)
- `review_moderation_queue`

##### 7b. Verified Purchase Check
```typescript
// TODO: Check if user has purchased the product (line 125)
// This requires integration with Saleor's order system
```

**Solution:** Query Saleor GraphQL API:
```graphql
query VerifyPurchase($email: String!, $productId: ID!) {
  orders(filter: { userEmail: $email }) {
    edges {
      node {
        lines {
          productSku
        }
      }
    }
  }
}
```

##### 7c. Review Moderation
```typescript
// TODO: Send notification to admin for moderation (line 145)
```

**Implementation:**
- Email notifications to admin
- Admin dashboard for review approval
- Auto-approve verified purchases (optional)
- Profanity filter integration
- Spam detection (duplicate content, suspicious patterns)

---

### 🎨 UI/UX Components (P2)

#### 8. Checkout Validation
**File:** [storefront/src/checkout/hooks/useForm/types.ts](storefront/src/checkout/hooks/useForm/types.ts)

**TODO:** Enhance form validation and error handling

**Priority:** P2 - Medium
**Effort:** Ongoing maintenance

---

### 📧 Email System (P2)

#### 9. Email Template Improvements
**File:** [storefront/src/lib/email.ts](storefront/src/lib/email.ts)

**TODO:** Enhance email templates and delivery system

**Priority:** P2 - Medium
**Effort:** 1-2 days

---

## 📝 Documentation TODOs

### Missing Documentation (P2)

1. **Database replica setup guide** - For production scalability
2. **Payment gateway integration guide** - For each supported provider
3. **Review system implementation** - Complete guide for review feature
4. **Multi-payment workflow** - When/if implemented
5. **Performance tuning guide** - Beyond current optimizations

---

## 🎯 Recommended Action Plan

### Immediate (Next 2 Weeks)
1. ✅ **Database connection pooling** - DONE
2. ✅ **Frontend dependency updates** - DONE
3. ⬜ **Implement product reviews database integration** (P1)
4. ⬜ **Add ISO 4217 currency validator** (P2)

### Short Term (1-2 Months)
5. ⬜ Review payment save logic and fix if needed
6. ⬜ Add comprehensive email validation
7. ⬜ Implement verified purchase checking
8. ⬜ Set up review moderation system

### Medium Term (3-6 Months)
9. ⬜ Multiple payments support
10. ⬜ Database replica configuration
11. ⬜ Enhanced transaction status workflow
12. ⬜ Complete review system with spam detection

### Long Term (6+ Months)
13. ⬜ Improve test coverage (Braintree mocks, etc.)
14. ⬜ Refactoring identified by TODOs
15. ⬜ Performance optimizations
16. ⬜ Advanced payment workflows

---

## 📊 Statistics

- **Total TODOs Found:** 20+
- **Backend TODOs:** 8
- **Frontend TODOs:** 11
- **Documentation Gaps:** 5

**Priority Breakdown:**
- P0 (Critical): 0
- P1 (High): 1 (Product Reviews)
- P2 (Medium): 8
- P3 (Low): 11

---

## 🔍 How to Find More TODOs

Use these commands to scan for additional items:

```bash
# Backend
grep -r "TODO\|FIXME\|XXX\|HACK" saleor/saleor --include="*.py"

# Frontend
grep -r "TODO\|FIXME\|XXX\|HACK" storefront/src --include="*.ts" --include="*.tsx"

# Find security-related TODOs
grep -ri "todo.*security\|fixme.*security" .

# Find performance-related TODOs
grep -ri "todo.*performance\|fixme.*performance\|todo.*optimize" .
```

---

## ✅ Completed Items

- ✅ Security improvements (Next.js config, gitignore)
- ✅ Frontend dependency updates
- ✅ Database connection pooling configuration
- ✅ Git repository initialization

---

**Note:** This tracker should be updated regularly as TODOs are addressed or new ones are discovered. Consider integrating with issue tracking system (GitHub Issues, Jira, etc.) for better project management.
