/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			// Local development
			{
				protocol: "http",
				hostname: "localhost",
			},
			{
				protocol: "http",
				hostname: "127.0.0.1",
			},
			// Saleor Cloud
			{
				protocol: "https",
				hostname: "*.saleor.cloud",
			},
			// AWS S3 (if using S3 for media storage)
			{
				protocol: "https",
				hostname: "*.amazonaws.com",
			},
			// Add your production domain here
			// {
			// 	protocol: "https",
			// 	hostname: "your-domain.com",
			// },
		],
	},
	typedRoutes: false,
	typescript: {
		// Only ignore TypeScript errors in development
		// In production, type errors will fail the build
		ignoreBuildErrors: process.env.NODE_ENV === "development",
	},
	eslint: {
		// Only ignore ESLint errors in development
		// In production, linting errors will fail the build
		ignoreDuringBuilds: process.env.NODE_ENV === "development",
	},
	// used in the Dockerfile
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
};

export default config;
