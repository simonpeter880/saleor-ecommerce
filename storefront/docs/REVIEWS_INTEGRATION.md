# Product Reviews Integration Guide

## Overview

The storefront includes a fully-featured product reviews system. Since Saleor doesn't have a built-in review system, there are several integration options available.

## Current Implementation

The reviews system currently uses **localStorage** for development/demo purposes. The UI is fully functional with features including:

- ⭐ 5-star rating system
- 📝 Review title and content
- ✅ Verified purchase badges
- 👍 Helpful voting
- 📊 Rating distribution statistics
- 🔄 Pagination and sorting
- 📱 Fully responsive design

## Integration Options

### Option 1: Saleor App (Recommended for Production)

Create a custom Saleor App to handle reviews as a microservice.

**Benefits:**
- Clean separation of concerns
- Independent scaling
- Can use any database
- Full control over review logic

**Implementation Steps:**

1. **Create a Saleor App** using the Saleor App Template:
   ```bash
   npx create-saleor-app@latest reviews-app
   ```

2. **Define Review Schema** in your app's database:
   ```typescript
   interface Review {
     id: string;
     productId: string;
     userId?: string;
     rating: number; // 1-5
     title: string;
     content: string;
     authorName: string;
     authorEmail: string;
     isVerifiedPurchase: boolean;
     helpfulCount: number;
     createdAt: Date;
     updatedAt: Date;
     status: 'pending' | 'approved' | 'rejected';
   }
   ```

3. **Expose GraphQL API** from your app:
   ```graphql
   type Query {
     productReviews(
       productId: ID!
       first: Int
       after: String
     ): ReviewConnection!

     reviewStatistics(productId: ID!): ReviewStatistics!
   }

   type Mutation {
     reviewCreate(input: ReviewCreateInput!): ReviewCreatePayload!
     reviewMarkHelpful(reviewId: ID!): ReviewMarkHelpfulPayload!
     reviewDelete(reviewId: ID!): ReviewDeletePayload!
   }
   ```

4. **Connect your storefront** to the app's GraphQL endpoint (already implemented in `/src/app/review-actions.ts`)

### Option 2: Saleor Metadata (Simple, No Backend Required)

Store reviews in Saleor's product metadata field.

**Benefits:**
- No additional backend needed
- Uses existing Saleor infrastructure
- Quick to implement

**Limitations:**
- Limited query capabilities
- Metadata has size limits
- Not ideal for high-volume reviews

**Implementation:**

Update `/src/app/review-actions.ts` to use Saleor's metadata mutations:

```graphql
mutation UpdateProductMetadata($id: ID!, $input: [MetadataInput!]!) {
  updateMetadata(id: $id, input: $input) {
    item {
      metadata {
        key
        value
      }
    }
  }
}
```

Store reviews as JSON in metadata:
```typescript
{
  key: "reviews",
  value: JSON.stringify({
    reviews: [...],
    statistics: {...}
  })
}
```

### Option 3: Third-Party Review Services

Integrate with established review platforms.

**Popular Services:**
- **Yotpo** - https://www.yotpo.com/
- **Trustpilot** - https://www.trustpilot.com/
- **Bazaarvoice** - https://www.bazaarvoice.com/
- **Reviews.io** - https://www.reviews.io/

**Benefits:**
- Professional moderation
- SEO optimization
- Rich features (photos, videos)
- Verified reviews
- Analytics dashboard

**Implementation:**
Replace the current review-actions.ts with API calls to your chosen service.

### Option 4: External Database with API

Create a simple Node.js/Python API that stores reviews in a database.

**Benefits:**
- Full control
- Can use any database (PostgreSQL, MongoDB, etc.)
- Easy to scale
- Can add advanced features

**Tech Stack Example:**
- **Backend**: Next.js API Routes or Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Hosting**: Railway or AWS

**Implementation:**

1. Create API routes in `/src/app/api/reviews/`:
   ```typescript
   // /src/app/api/reviews/[productId]/route.ts
   export async function GET(request: Request) {
     // Fetch reviews from database
   }

   export async function POST(request: Request) {
     // Create new review
   }
   ```

2. Update review-actions.ts to call these API routes instead of GraphQL

## Current Code Structure

### Files to Update for Backend Integration:

1. **`/src/app/review-actions.ts`** - Server actions for reviews
   - Update GraphQL queries to match your backend schema
   - Or replace with API calls to external service

2. **`/src/ui/components/ProductReviews.tsx`** - Main review component
   - Already uses the server actions
   - No changes needed if you update review-actions.ts

3. **`/src/ui/components/ProductReviewForm.tsx`** - Review submission form
   - No changes needed

4. **`/src/ui/components/ProductReviewCard.tsx`** - Individual review display
   - No changes needed

## Environment Variables

Add to your `.env.local`:

```bash
# If using Saleor App
NEXT_PUBLIC_REVIEWS_API_URL=https://your-reviews-app.example.com/graphql

# If using third-party service
REVIEWS_API_KEY=your_api_key
REVIEWS_API_SECRET=your_api_secret
```

## Features Already Implemented

✅ Rating and review submission
✅ Review display with pagination
✅ Helpful voting system
✅ Rating statistics and distribution
✅ Verified purchase badges
✅ Review sorting (helpful, recent)
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Form validation

## Next Steps

1. **Choose your integration option** based on your requirements
2. **Set up the backend** (if needed)
3. **Update review-actions.ts** with your backend endpoints
4. **Test the integration** thoroughly
5. **Add moderation** (approve/reject reviews)
6. **Configure email notifications** for new reviews
7. **Add review analytics** to track engagement

## Testing

To test the current implementation:

1. Visit any product page
2. Click "Write a Review"
3. Submit a review (stored in localStorage for now)
4. Reviews will appear immediately below the product

## Production Checklist

Before going live:

- [ ] Choose and implement backend integration
- [ ] Set up review moderation system
- [ ] Add spam detection (reCAPTCHA, rate limiting)
- [ ] Implement email verification for reviewers
- [ ] Set up automated email notifications
- [ ] Add review content filtering (profanity, etc.)
- [ ] Configure backup/export for review data
- [ ] Test verified purchase logic
- [ ] Add admin dashboard for review management
- [ ] Set up analytics tracking for reviews

## Support

For questions about:
- **Saleor integration**: https://docs.saleor.io/
- **Saleor Apps**: https://docs.saleor.io/docs/3.x/developer/extending/apps/overview
- **This implementation**: Check `/src/app/review-actions.ts` and component files

## Example: Quick Saleor App Setup

```bash
# 1. Create new Saleor app
npx create-saleor-app@latest my-reviews-app

# 2. Install dependencies
cd my-reviews-app
pnpm install

# 3. Add database (example with Prisma + PostgreSQL)
pnpm add prisma @prisma/client
npx prisma init

# 4. Define schema in prisma/schema.prisma
# 5. Run migrations
npx prisma migrate dev

# 6. Create GraphQL resolvers for reviews
# 7. Deploy your app

# 8. Install app in your Saleor dashboard
# 9. Update NEXT_PUBLIC_REVIEWS_API_URL in storefront
```

## Architecture Diagram

```
┌─────────────────┐
│   Storefront    │
│   (Next.js)     │
└────────┬────────┘
         │
         │ GraphQL/REST API
         │
    ┌────┴────────────────────┐
    │                         │
┌───▼──────────┐    ┌────────▼─────────┐
│  Saleor App  │    │  External API    │
│  (Reviews)   │    │  (Alternative)   │
└───┬──────────┘    └────────┬─────────┘
    │                        │
┌───▼──────────┐    ┌────────▼─────────┐
│  PostgreSQL  │    │   Any Database   │
└──────────────┘    └──────────────────┘
```
