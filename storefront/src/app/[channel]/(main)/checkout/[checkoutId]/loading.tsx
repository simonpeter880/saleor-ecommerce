export default function Loading() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Progress Steps Skeleton */}
				<div className="flex items-center justify-center gap-4 mb-8 animate-pulse">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-gray-200" />
							<div className="h-4 w-16 bg-gray-200 rounded hidden sm:block" />
							{i < 3 && <div className="w-8 h-0.5 bg-gray-200" />}
						</div>
					))}
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content Skeleton */}
					<div className="lg:col-span-2 space-y-6">
						{/* Contact Section */}
						<div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
							<div className="h-6 w-32 bg-gray-200 rounded mb-6" />
							<div className="space-y-4">
								<div className="h-12 bg-gray-200 rounded-xl" />
							</div>
						</div>

						{/* Shipping Address Section */}
						<div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
							<div className="h-6 w-40 bg-gray-200 rounded mb-6" />
							<div className="grid grid-cols-2 gap-4">
								<div className="h-12 bg-gray-200 rounded-xl" />
								<div className="h-12 bg-gray-200 rounded-xl" />
								<div className="h-12 bg-gray-200 rounded-xl col-span-2" />
								<div className="h-12 bg-gray-200 rounded-xl" />
								<div className="h-12 bg-gray-200 rounded-xl" />
								<div className="h-12 bg-gray-200 rounded-xl" />
								<div className="h-12 bg-gray-200 rounded-xl" />
							</div>
						</div>

						{/* Shipping Method Section */}
						<div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
							<div className="h-6 w-36 bg-gray-200 rounded mb-6" />
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div key={i} className="p-4 border border-gray-200 rounded-xl flex items-center gap-4">
										<div className="w-5 h-5 rounded-full bg-gray-200" />
										<div className="flex-1">
											<div className="h-4 w-32 bg-gray-200 rounded mb-2" />
											<div className="h-3 w-48 bg-gray-200 rounded" />
										</div>
										<div className="h-5 w-16 bg-gray-200 rounded" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Order Summary Skeleton */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 animate-pulse">
							<div className="h-6 w-32 bg-gray-200 rounded mb-6" />

							{/* Cart Items */}
							<div className="space-y-4 mb-6">
								{[1, 2].map((i) => (
									<div key={i} className="flex gap-4">
										<div className="w-16 h-16 bg-gray-200 rounded-lg" />
										<div className="flex-1">
											<div className="h-4 w-full bg-gray-200 rounded mb-2" />
											<div className="h-3 w-16 bg-gray-200 rounded" />
										</div>
										<div className="h-4 w-12 bg-gray-200 rounded" />
									</div>
								))}
							</div>

							{/* Totals */}
							<div className="border-t border-gray-200 pt-4 space-y-2">
								<div className="flex justify-between">
									<div className="h-4 w-16 bg-gray-200 rounded" />
									<div className="h-4 w-16 bg-gray-200 rounded" />
								</div>
								<div className="flex justify-between">
									<div className="h-4 w-16 bg-gray-200 rounded" />
									<div className="h-4 w-16 bg-gray-200 rounded" />
								</div>
								<div className="flex justify-between pt-2 border-t border-gray-200">
									<div className="h-6 w-12 bg-gray-200 rounded" />
									<div className="h-6 w-20 bg-gray-200 rounded" />
								</div>
							</div>

							{/* Button */}
							<div className="h-14 bg-gray-200 rounded-xl mt-6" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
