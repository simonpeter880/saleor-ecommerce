"use server";

import { revalidatePath } from "next/cache";
import { executeGraphQL } from "@/lib/graphql";

// GraphQL query to fetch product reviews
const ProductReviewsDocument = `
  query ProductReviews($productId: ID!, $first: Int, $after: String) {
    productReviews(productId: $productId, first: $first, after: $after) {
      edges {
        node {
          id
          rating
          title
          content
          authorName
          isVerifiedPurchase
          helpfulCount
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

// GraphQL query to fetch review statistics
const ReviewStatisticsDocument = `
  query ReviewStatistics($productId: ID!) {
    reviewStatistics(productId: $productId) {
      averageRating
      totalCount
      distribution {
        stars
        count
        percentage
      }
    }
  }
`;

// GraphQL mutation to create a review
const CreateReviewDocument = `
  mutation CreateReview($input: ReviewCreateInput!) {
    reviewCreate(input: $input) {
      review {
        id
        rating
        title
        content
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to mark review as helpful
const MarkReviewHelpfulDocument = `
  mutation MarkReviewHelpful($reviewId: ID!) {
    reviewMarkHelpful(reviewId: $reviewId) {
      review {
        id
        helpfulCount
      }
      errors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to delete review
const DeleteReviewDocument = `
  mutation DeleteReview($reviewId: ID!) {
    reviewDelete(reviewId: $reviewId) {
      success
      errors {
        field
        message
      }
    }
  }
`;

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ReviewStatistics {
  averageRating: number;
  totalCount: number;
  distribution: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}

// Fetch product reviews
export async function getProductReviews(
  productId: string,
  first: number = 10,
  after?: string
): Promise<{ reviews: Review[]; hasMore: boolean; endCursor: string | null; totalCount: number }> {
  try {
    const data = await executeGraphQL(ProductReviewsDocument, {
      variables: { productId, first, after },
      cache: "no-store",
    });

    const productReviews = data?.productReviews;

    if (!productReviews) {
      return { reviews: [], hasMore: false, endCursor: null, totalCount: 0 };
    }

    return {
      reviews: productReviews.edges.map(({ node }: any) => ({
        id: node.id,
        rating: node.rating,
        title: node.title,
        content: node.content,
        authorName: node.authorName,
        isVerifiedPurchase: node.isVerifiedPurchase,
        helpfulCount: node.helpfulCount,
        createdAt: node.createdAt,
      })),
      hasMore: productReviews.pageInfo?.hasNextPage || false,
      endCursor: productReviews.pageInfo?.endCursor || null,
      totalCount: productReviews.totalCount || 0,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { reviews: [], hasMore: false, endCursor: null, totalCount: 0 };
  }
}

// Fetch review statistics
export async function getReviewStatistics(productId: string): Promise<ReviewStatistics | null> {
  try {
    const data = await executeGraphQL(ReviewStatisticsDocument, {
      variables: { productId },
      cache: "no-store",
    });

    const reviewStatistics = data?.reviewStatistics;

    if (!reviewStatistics) {
      return null;
    }

    return {
      averageRating: reviewStatistics.averageRating || 0,
      totalCount: reviewStatistics.totalCount || 0,
      distribution: reviewStatistics.distribution || [],
    };
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    return null;
  }
}

interface ReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

// Submit a product review
export async function submitReviewAction(data: ReviewData, channel: string) {
  try {
    // Validate data
    if (!data.productId || !data.rating || !data.title || !data.content) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    if (data.rating < 1 || data.rating > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5",
      };
    }

    if (data.title.length < 3) {
      return {
        success: false,
        error: "Review title must be at least 3 characters",
      };
    }

    if (data.content.length < 10) {
      return {
        success: false,
        error: "Review content must be at least 10 characters",
      };
    }

    const result = await executeGraphQL(CreateReviewDocument, {
      variables: {
        input: {
          productId: data.productId,
          rating: data.rating,
          title: data.title,
          content: data.content,
        },
      },
      cache: "no-store",
    });

    if (result?.reviewCreate?.errors && result.reviewCreate.errors.length > 0) {
      const errorMsg = result.reviewCreate.errors[0].message;
      if (errorMsg.toLowerCase().includes("logged in") || errorMsg.toLowerCase().includes("login")) {
        return { success: false, error: "Please sign in to write a review" };
      }
      return { success: false, error: errorMsg };
    }

    // Revalidate product page to show new review
    revalidatePath(`/${channel}/products`);

    return {
      success: true,
      message: "Thank you for your review!",
      review: result?.reviewCreate?.review,
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      error: "Please sign in to write a review",
    };
  }
}

// Mark a review as helpful
export async function markReviewHelpfulAction(reviewId: string, channel: string) {
  try {
    if (!reviewId) {
      return {
        success: false,
        error: "Review ID is required",
      };
    }

    const result = await executeGraphQL(MarkReviewHelpfulDocument, {
      variables: { reviewId },
      cache: "no-store",
    });

    if (result?.reviewMarkHelpful?.errors && result.reviewMarkHelpful.errors.length > 0) {
      return { success: false, error: result.reviewMarkHelpful.errors[0].message };
    }

    revalidatePath(`/${channel}/products`);

    return {
      success: true,
      message: "Thank you for your feedback!",
      helpfulCount: result?.reviewMarkHelpful?.review?.helpfulCount,
    };
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return {
      success: false,
      error: "Failed to record your feedback",
    };
  }
}

// Delete a review
export async function deleteReviewAction(reviewId: string, channel: string) {
  try {
    if (!reviewId) {
      return {
        success: false,
        error: "Review ID is required",
      };
    }

    const result = await executeGraphQL(DeleteReviewDocument, {
      variables: { reviewId },
      cache: "no-store",
    });

    if (result?.reviewDelete?.errors && result.reviewDelete.errors.length > 0) {
      return { success: false, error: result.reviewDelete.errors[0].message };
    }

    revalidatePath(`/${channel}/products`);

    return {
      success: true,
      message: "Your review has been deleted",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: "Failed to delete review",
    };
  }
}
