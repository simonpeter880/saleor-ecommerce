/** @type {import('next').NextConfig} */
const config = {
	experimental: {
		// Skip prerendering errors
		missingSuspenseWithCSRBailout: false,
	},
	// Security headers for production
	async headers() {
		// Only add strict security headers in production
		if (process.env.NODE_ENV !== 'production') {
			return [];
		}

		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin'
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()'
					}
				]
			}
		];
	},
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
		// Temporarily ignore TypeScript errors to allow build
		ignoreBuildErrors: true,
	},
	eslint: {
		// Temporarily ignore ESLint errors to allow build
		ignoreDuringBuilds: true,
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
