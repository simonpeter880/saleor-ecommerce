# TypeScript Strict Mode - Error Summary

**Date**: 2026-01-11
**Branch**: `feature/simplify-storefront`
**Total Errors**: 342

## Error Breakdown

### Production Code: 191 errors
- **TS6133 (74 errors)**: Unused variables/parameters
  - Action: Remove or prefix with `_`
  - Impact: Low - code cleanup

- **TS2339 (49 errors)**: Property does not exist on type
  - Action: Fix GraphQL queries to include missing fields
  - Impact: **HIGH** - Runtime errors possible
  - Examples:
    - `product.media` not in query (TemuProductPage)
    - `product.rating` not in query (product page)
    - `product.reviews` not in query (product page)
    - `category.slug` not in query (multiple pages)

- **TS2345 (22 errors)**: Argument type mismatch
  - Action: Add type assertions or fix types
  - Impact: Medium - type safety issues

- **TS2322 (19 errors)**: Assignment type mismatch
  - Action: Add type guards or assertions
  - Impact: Medium - type safety issues

- **Others (27 errors)**: Various type issues
  - TS2307: Cannot find module (7)
  - TS18046: Type 'unknown' (6)
  - TS7006: Implicit 'any' (2)
  - Misc (12)

### Test Files: 151 errors
- **TS18046 (142 errors)**: `data` is of type 'unknown'
  - Action: Add proper type assertions in tests
  - Impact: Low - tests still run

- **Others (9 errors)**: Module imports and test setup

## Critical Issues to Fix (Priority Order)

### 1. GraphQL Query Mismatches (HIGH PRIORITY)
**Files affected**:
- `src/app/[channel]/(main)/products/[slug]/page.tsx`
- `src/ui/components/TemuProductPage.tsx`
- `src/app/[channel]/(main)/categories/[slug]/page.tsx`

**Problem**: Code expects fields not included in GraphQL queries
- `product.media` - Used but not queried
- `product.rating` - Used but not queried
- `product.reviews` - Used but not queried
- `category.slug` - Used but not queried

**Fix**: Update GraphQL queries to include missing fields OR remove usage of non-existent fields

### 2. Type Mismatches in Product Pages
**Files affected**:
- `src/app/[channel]/(main)/page.tsx:41`
- `src/app/[channel]/(main)/categories/[slug]/page.tsx:57`
- `src/app/[channel]/(main)/products/[slug]/page.tsx:193-212`

**Problem**: GraphQL return types don't match expected component prop types

**Fix**: Create type adapters or update component interfaces

### 3. Missing Type Guards
**File**: `src/app/[channel]/(main)/pages/[slug]/page.tsx:43`

**Problem**: Calling `.map()` on potentially non-array type

**Fix**: Add runtime type guard before .map()

### 4. Auth Client API Change
**File**: `src/app/[channel]/(main)/orders/[orderId]/page.tsx:22`

**Problem**: `fetchAuth` doesn't exist on SaleorAuthClient

**Fix**: Update to correct Saleor Auth SDK API

## Recommendation

**Option A**: Fix critical errors incrementally (Recommended)
1. Fix GraphQL query mismatches (HIGH PRIORITY)
2. Fix unused variables (quick wins)
3. Continue with Phase 4 migration
4. Fix remaining type errors in Phase 7

**Option B**: Temporarily relax strict mode
1. Set `strict: false` temporarily
2. Continue Phase 4-6 migrations
3. Re-enable strict mode and fix all errors in Phase 7

**Option C**: Fix all errors before continuing
1. Systematically fix all 191 production errors
2. Then continue with Phase 4
3. Most thorough but time-consuming

## Current State

✅ TypeScript strict mode enabled
✅ Jest types configured
✅ Build cache cleared
⚠️ 191 production code errors identified
⚠️ 151 test file errors identified
❌ Build will fail until critical errors fixed

## Next Steps

Recommended: **Option A** - Fix critical GraphQL query mismatches first, then continue with Phase 4.

These GraphQL errors could cause runtime failures in production, so they should be addressed before deploying.
