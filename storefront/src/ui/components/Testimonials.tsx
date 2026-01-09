export interface Testimonial {
	id: string;
	name: string;
	role: string;
	content: string;
	rating: number;
	date: string;
	product?: string;
}

interface TestimonialsProps {
	testimonials?: Testimonial[];
	title?: string;
	subtitle?: string;
}

const defaultTestimonials: Testimonial[] = [
	{
		id: "1",
		name: "Sarah Johnson",
		role: "Tech Enthusiast",
		content:
			"Ordered my new MacBook from TechHub and couldn't be happier! Fast shipping, competitive price, and excellent customer service. The product arrived perfectly packaged and works flawlessly.",
		rating: 5,
		date: "2024-12-15",
		product: "MacBook Pro 16-inch",
	},
	{
		id: "2",
		name: "Michael Chen",
		role: "Professional Gamer",
		content:
			"Best place to buy gaming gear! Got my PlayStation 5 here when it was sold out everywhere else. The team was super helpful and even helped me pick the right accessories. Highly recommend!",
		rating: 5,
		date: "2024-12-10",
		product: "PlayStation 5",
	},
	{
		id: "3",
		name: "Emily Rodriguez",
		role: "Software Developer",
		content:
			"I've purchased three laptops from TechHub for my team. Every time, the experience has been seamless. Genuine products, great prices, and their warranty support is top-notch.",
		rating: 5,
		date: "2024-12-05",
		product: "Dell XPS 15",
	},
	{
		id: "4",
		name: "David Thompson",
		role: "Smart Home Enthusiast",
		content:
			"Transformed my home with smart devices from TechHub. Their selection is amazing and the staff helped me choose compatible products. Everything works perfectly together!",
		rating: 5,
		date: "2024-11-28",
		product: "Smart Home Bundle",
	},
	{
		id: "5",
		name: "Lisa Anderson",
		role: "Photography Professional",
		content:
			"Bought my new camera and accessories here. The product knowledge of the support team is impressive - they helped me pick the perfect setup for my needs. Will definitely shop here again!",
		rating: 5,
		date: "2024-11-20",
		product: "Sony A7 IV",
	},
	{
		id: "6",
		name: "James Wilson",
		role: "Student",
		content:
			"As a student, I needed a reliable laptop that wouldn't break the bank. TechHub had great deals and the team helped me find the perfect balance of performance and price. Super happy with my purchase!",
		rating: 5,
		date: "2024-11-15",
		product: "Lenovo ThinkPad",
	},
];

function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex gap-1">
			{[...Array(5)].map((_, index) => (
				<svg
					key={index}
					className={`h-5 w-5 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
}

export function Testimonials({
	testimonials = defaultTestimonials,
	title = "What Our Customers Say",
	subtitle = "Don't just take our word for it - hear from satisfied customers who've upgraded their tech with TechHub",
}: TestimonialsProps) {
	return (
		<section className="bg-neutral-50 py-16">
			<div className="mx-auto max-w-7xl px-8">
				{/* Header */}
				<div className="mb-12 text-center">
					<h2 className="text-3xl font-bold text-gray-900">{title}</h2>
					<p className="mt-2 text-gray-600">{subtitle}</p>
				</div>

				{/* Testimonials Grid */}
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
						>
							{/* Rating */}
							<div className="mb-4">
								<StarRating rating={testimonial.rating} />
							</div>

							{/* Content */}
							<p className="mb-4 text-gray-700">{testimonial.content}</p>

							{/* Product */}
							{testimonial.product && (
								<div className="mb-4 rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-700">
									{testimonial.product}
								</div>
							)}

							{/* Author */}
							<div className="flex items-center gap-3 border-t border-neutral-200 pt-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
									{testimonial.name.charAt(0)}
								</div>
								<div>
									<div className="font-semibold text-gray-900">{testimonial.name}</div>
									<div className="text-sm text-gray-500">{testimonial.role}</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Trust Stats */}
				<div className="mt-12 grid gap-6 rounded-2xl bg-white p-8 md:grid-cols-3">
					<div className="text-center">
						<div className="mb-2 flex justify-center">
							<svg
								className="h-10 w-10 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
								/>
							</svg>
						</div>
						<div className="text-2xl font-bold text-gray-900">4.9/5.0</div>
						<div className="text-sm text-gray-600">Average Rating</div>
					</div>
					<div className="text-center">
						<div className="mb-2 flex justify-center">
							<svg
								className="h-10 w-10 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div className="text-2xl font-bold text-gray-900">50K+</div>
						<div className="text-sm text-gray-600">Happy Customers</div>
					</div>
					<div className="text-center">
						<div className="mb-2 flex justify-center">
							<svg
								className="h-10 w-10 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="text-2xl font-bold text-gray-900">99%</div>
						<div className="text-sm text-gray-600">Satisfaction Rate</div>
					</div>
				</div>
			</div>
		</section>
	);
}
