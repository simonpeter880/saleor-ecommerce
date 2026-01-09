import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/reviews/[productId]/statistics
 * Fetch review statistics for a product
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ productId: string }> }
) {
	try {
		const { productId } = await params;

		// TODO: Replace with actual database query
		// Example with Prisma:
		// const stats = await prisma.review.groupBy({
		//   by: ['rating'],
		//   where: { productId, status: 'approved' },
		//   _count: { rating: true },
		// });
		//
		// const totalReviews = stats.reduce((sum, stat) => sum + stat._count.rating, 0);
		// const averageRating = stats.reduce(
		//   (sum, stat) => sum + stat.rating * stat._count.rating,
		//   0
		// ) / totalReviews;

		// Calculate distribution
		// const distribution = [5, 4, 3, 2, 1].map(stars => {
		//   const count = stats.find(s => s.rating === stars)?._count.rating || 0;
		//   return {
		//     stars,
		//     count,
		//     percentage: (count / totalReviews) * 100,
		//   };
		// });

		// Mock response
		const statistics = {
			averageRating: 0,
			totalCount: 0,
			distribution: [
				{ stars: 5, count: 0, percentage: 0 },
				{ stars: 4, count: 0, percentage: 0 },
				{ stars: 3, count: 0, percentage: 0 },
				{ stars: 2, count: 0, percentage: 0 },
				{ stars: 1, count: 0, percentage: 0 },
			],
		};

		return NextResponse.json(statistics);
	} catch (error) {
		console.error("Error fetching review statistics:", error);
		return NextResponse.json(
			{ error: "Failed to fetch statistics" },
			{ status: 500 }
		);
	}
}
