interface Specification {
	label: string;
	value: string;
}

interface ProductSpecificationsProps {
	specifications: Specification[];
}

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
	if (!specifications || specifications.length === 0) {
		return null;
	}

	return (
		<div className="mt-8">
			<h3 className="mb-4 text-lg font-bold text-gray-900">Technical Specifications</h3>
			<div className="overflow-hidden rounded-lg border border-neutral-200">
				<table className="w-full">
					<tbody className="divide-y divide-neutral-200">
						{specifications.map((spec, index) => (
							<tr
								key={index}
								className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
							>
								<td className="px-6 py-4 text-sm font-medium text-gray-900">
									{spec.label}
								</td>
								<td className="px-6 py-4 text-sm text-gray-700">{spec.value}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

// Default specifications for common product types
export const getDefaultSpecifications = (productType: string): Specification[] => {
	const commonSpecs: Record<string, Specification[]> = {
		smartphone: [
			{ label: "Display", value: "6.1-inch OLED" },
			{ label: "Processor", value: "Latest generation chip" },
			{ label: "RAM", value: "8GB" },
			{ label: "Storage", value: "128GB / 256GB / 512GB" },
			{ label: "Camera", value: "Advanced camera system" },
			{ label: "Battery", value: "All-day battery life" },
			{ label: "5G", value: "Yes" },
			{ label: "Operating System", value: "Latest OS" },
		],
		laptop: [
			{ label: "Display", value: "15.6-inch high resolution" },
			{ label: "Processor", value: "Latest generation processor" },
			{ label: "RAM", value: "16GB" },
			{ label: "Storage", value: "512GB SSD" },
			{ label: "Graphics", value: "Integrated / Dedicated" },
			{ label: "Battery Life", value: "Up to 10 hours" },
			{ label: "Ports", value: "USB-C, USB-A, HDMI" },
			{ label: "Weight", value: "Lightweight design" },
		],
		tablet: [
			{ label: "Display", value: "10.9-inch Liquid Retina" },
			{ label: "Processor", value: "Latest generation chip" },
			{ label: "Storage", value: "64GB / 256GB" },
			{ label: "Camera", value: "12MP Wide camera" },
			{ label: "Battery Life", value: "Up to 10 hours" },
			{ label: "Connectivity", value: "Wi-Fi 6" },
			{ label: "Apple Pencil", value: "Compatible" },
			{ label: "Weight", value: "1.0 lb" },
		],
		"gaming-console": [
			{ label: "Graphics", value: "4K gaming capability" },
			{ label: "Storage", value: "1TB SSD" },
			{ label: "Frame Rate", value: "Up to 120fps" },
			{ label: "Ray Tracing", value: "Yes" },
			{ label: "Backward Compatibility", value: "Supported" },
			{ label: "Online Gaming", value: "Subscription required" },
			{ label: "HDR", value: "Supported" },
			{ label: "Audio", value: "3D spatial audio" },
		],
	};

	return commonSpecs[productType] || [];
};
