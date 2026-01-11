/**
 * Dynamic Product Filters
 *
 * Category-specific filters that adapt based on product type:
 * - Laptops: RAM, Storage, Processor, Screen Size
 * - Smartphones: RAM, Storage, Camera, Battery, Screen Size
 * - Tablets: Storage, Screen Size, Battery
 * - Accessories: Type, Compatibility, Brand
 *
 * Expected Impact: 2.5+ filters per session, +15% conversion
 */

export interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
  selected?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: string;
}

export interface CategoryFilters {
  categorySlug: string;
  categoryName: string;
  filters: FilterGroup[];
}

/**
 * Get available filters for a specific category
 */
export function getCategoryFilters(categorySlug: string): FilterGroup[] {
  const baseFilters = getBaseFilters();
  const categorySpecificFilters = getCategorySpecificFilters(categorySlug);

  return [...categorySpecificFilters, ...baseFilters];
}

/**
 * Base filters available for all categories
 */
function getBaseFilters(): FilterGroup[] {
  return [
    {
      id: 'price',
      label: 'Price Range',
      type: 'range',
      min: 0,
      max: 10000000, // 10M UGX
      step: 50000, // 50K UGX
      unit: 'UGX',
      icon: '💰',
    },
    {
      id: 'brand',
      label: 'Brand',
      type: 'checkbox',
      options: [
        { id: 'apple', label: 'Apple', value: 'apple', count: 0 },
        { id: 'samsung', label: 'Samsung', value: 'samsung', count: 0 },
        { id: 'hp', label: 'HP', value: 'hp', count: 0 },
        { id: 'dell', label: 'Dell', value: 'dell', count: 0 },
        { id: 'lenovo', label: 'Lenovo', value: 'lenovo', count: 0 },
        { id: 'huawei', label: 'Huawei', value: 'huawei', count: 0 },
        { id: 'xiaomi', label: 'Xiaomi', value: 'xiaomi', count: 0 },
        { id: 'oppo', label: 'OPPO', value: 'oppo', count: 0 },
        { id: 'tecno', label: 'TECNO', value: 'tecno', count: 0 },
        { id: 'infinix', label: 'Infinix', value: 'infinix', count: 0 },
      ],
      icon: '🏷️',
    },
    {
      id: 'rating',
      label: 'Customer Rating',
      type: 'checkbox',
      options: [
        { id: 'rating-5', label: '5 Stars', value: 5, count: 0 },
        { id: 'rating-4', label: '4+ Stars', value: 4, count: 0 },
        { id: 'rating-3', label: '3+ Stars', value: 3, count: 0 },
      ],
      icon: '⭐',
    },
    {
      id: 'availability',
      label: 'Availability',
      type: 'checkbox',
      options: [
        { id: 'in-stock', label: 'In Stock', value: 'in-stock', count: 0 },
        { id: 'pre-order', label: 'Pre-Order', value: 'pre-order', count: 0 },
      ],
      icon: '📦',
    },
  ];
}

/**
 * Get category-specific filters
 */
function getCategorySpecificFilters(categorySlug: string): FilterGroup[] {
  const lowerSlug = categorySlug.toLowerCase();

  if (lowerSlug.includes('laptop') || lowerSlug.includes('notebook')) {
    return getLaptopFilters();
  } else if (lowerSlug.includes('phone') || lowerSlug.includes('smartphone')) {
    return getSmartphoneFilters();
  } else if (lowerSlug.includes('tablet')) {
    return getTabletFilters();
  } else if (lowerSlug.includes('headphone') || lowerSlug.includes('earphone') || lowerSlug.includes('audio')) {
    return getAudioFilters();
  } else if (lowerSlug.includes('watch') || lowerSlug.includes('smartwatch')) {
    return getWatchFilters();
  } else if (lowerSlug.includes('accessory') || lowerSlug.includes('accessories')) {
    return getAccessoryFilters();
  }

  return [];
}

/**
 * Laptop-specific filters
 */
function getLaptopFilters(): FilterGroup[] {
  return [
    {
      id: 'processor',
      label: 'Processor',
      type: 'checkbox',
      options: [
        { id: 'intel-i9', label: 'Intel Core i9', value: 'intel-i9', count: 0 },
        { id: 'intel-i7', label: 'Intel Core i7', value: 'intel-i7', count: 0 },
        { id: 'intel-i5', label: 'Intel Core i5', value: 'intel-i5', count: 0 },
        { id: 'intel-i3', label: 'Intel Core i3', value: 'intel-i3', count: 0 },
        { id: 'amd-ryzen-9', label: 'AMD Ryzen 9', value: 'amd-ryzen-9', count: 0 },
        { id: 'amd-ryzen-7', label: 'AMD Ryzen 7', value: 'amd-ryzen-7', count: 0 },
        { id: 'amd-ryzen-5', label: 'AMD Ryzen 5', value: 'amd-ryzen-5', count: 0 },
        { id: 'apple-silicon', label: 'Apple Silicon (M1/M2/M3)', value: 'apple-silicon', count: 0 },
      ],
      icon: '🔧',
    },
    {
      id: 'ram',
      label: 'RAM',
      type: 'checkbox',
      options: [
        { id: 'ram-4gb', label: '4 GB', value: 4, count: 0 },
        { id: 'ram-8gb', label: '8 GB', value: 8, count: 0 },
        { id: 'ram-16gb', label: '16 GB', value: 16, count: 0 },
        { id: 'ram-32gb', label: '32 GB', value: 32, count: 0 },
        { id: 'ram-64gb', label: '64 GB+', value: 64, count: 0 },
      ],
      icon: '💾',
    },
    {
      id: 'storage',
      label: 'Storage',
      type: 'checkbox',
      options: [
        { id: 'storage-256gb', label: '256 GB', value: 256, count: 0 },
        { id: 'storage-512gb', label: '512 GB', value: 512, count: 0 },
        { id: 'storage-1tb', label: '1 TB', value: 1024, count: 0 },
        { id: 'storage-2tb', label: '2 TB+', value: 2048, count: 0 },
      ],
      icon: '💿',
    },
    {
      id: 'storage-type',
      label: 'Storage Type',
      type: 'checkbox',
      options: [
        { id: 'ssd', label: 'SSD', value: 'ssd', count: 0 },
        { id: 'nvme', label: 'NVMe SSD', value: 'nvme', count: 0 },
        { id: 'hdd', label: 'HDD', value: 'hdd', count: 0 },
        { id: 'hybrid', label: 'Hybrid (SSD + HDD)', value: 'hybrid', count: 0 },
      ],
      icon: '⚡',
    },
    {
      id: 'screen-size',
      label: 'Screen Size',
      type: 'checkbox',
      options: [
        { id: 'screen-13', label: '13" and below', value: 13, count: 0 },
        { id: 'screen-14', label: '14"', value: 14, count: 0 },
        { id: 'screen-15', label: '15" - 16"', value: 15, count: 0 },
        { id: 'screen-17', label: '17" and above', value: 17, count: 0 },
      ],
      icon: '🖥️',
    },
    {
      id: 'graphics',
      label: 'Graphics',
      type: 'checkbox',
      options: [
        { id: 'integrated', label: 'Integrated Graphics', value: 'integrated', count: 0 },
        { id: 'nvidia-rtx', label: 'NVIDIA RTX', value: 'nvidia-rtx', count: 0 },
        { id: 'nvidia-gtx', label: 'NVIDIA GTX', value: 'nvidia-gtx', count: 0 },
        { id: 'amd-radeon', label: 'AMD Radeon', value: 'amd-radeon', count: 0 },
      ],
      icon: '🎮',
    },
  ];
}

/**
 * Smartphone-specific filters
 */
function getSmartphoneFilters(): FilterGroup[] {
  return [
    {
      id: 'ram',
      label: 'RAM',
      type: 'checkbox',
      options: [
        { id: 'ram-2gb', label: '2 GB', value: 2, count: 0 },
        { id: 'ram-3gb', label: '3 GB', value: 3, count: 0 },
        { id: 'ram-4gb', label: '4 GB', value: 4, count: 0 },
        { id: 'ram-6gb', label: '6 GB', value: 6, count: 0 },
        { id: 'ram-8gb', label: '8 GB', value: 8, count: 0 },
        { id: 'ram-12gb', label: '12 GB+', value: 12, count: 0 },
      ],
      icon: '💾',
    },
    {
      id: 'storage',
      label: 'Storage',
      type: 'checkbox',
      options: [
        { id: 'storage-32gb', label: '32 GB', value: 32, count: 0 },
        { id: 'storage-64gb', label: '64 GB', value: 64, count: 0 },
        { id: 'storage-128gb', label: '128 GB', value: 128, count: 0 },
        { id: 'storage-256gb', label: '256 GB', value: 256, count: 0 },
        { id: 'storage-512gb', label: '512 GB+', value: 512, count: 0 },
      ],
      icon: '💿',
    },
    {
      id: 'screen-size',
      label: 'Screen Size',
      type: 'checkbox',
      options: [
        { id: 'screen-5', label: 'Below 6"', value: 5, count: 0 },
        { id: 'screen-6', label: '6" - 6.5"', value: 6, count: 0 },
        { id: 'screen-65', label: '6.5" - 7"', value: 6.5, count: 0 },
        { id: 'screen-7', label: 'Above 7"', value: 7, count: 0 },
      ],
      icon: '📱',
    },
    {
      id: 'camera',
      label: 'Main Camera',
      type: 'checkbox',
      options: [
        { id: 'camera-12mp', label: 'Up to 12 MP', value: 12, count: 0 },
        { id: 'camera-48mp', label: '13 - 48 MP', value: 48, count: 0 },
        { id: 'camera-64mp', label: '49 - 64 MP', value: 64, count: 0 },
        { id: 'camera-108mp', label: '65 MP and above', value: 108, count: 0 },
      ],
      icon: '📷',
    },
    {
      id: 'battery',
      label: 'Battery Capacity',
      type: 'checkbox',
      options: [
        { id: 'battery-3000', label: 'Up to 3000 mAh', value: 3000, count: 0 },
        { id: 'battery-4000', label: '3001 - 4000 mAh', value: 4000, count: 0 },
        { id: 'battery-5000', label: '4001 - 5000 mAh', value: 5000, count: 0 },
        { id: 'battery-6000', label: '5000 mAh and above', value: 6000, count: 0 },
      ],
      icon: '🔋',
    },
    {
      id: '5g',
      label: '5G Support',
      type: 'checkbox',
      options: [
        { id: '5g-yes', label: '5G Enabled', value: 'yes', count: 0 },
        { id: '5g-no', label: '4G/LTE Only', value: 'no', count: 0 },
      ],
      icon: '📡',
    },
  ];
}

/**
 * Tablet-specific filters
 */
function getTabletFilters(): FilterGroup[] {
  return [
    {
      id: 'screen-size',
      label: 'Screen Size',
      type: 'checkbox',
      options: [
        { id: 'screen-8', label: '7" - 8"', value: 8, count: 0 },
        { id: 'screen-10', label: '9" - 10"', value: 10, count: 0 },
        { id: 'screen-11', label: '11" - 12"', value: 11, count: 0 },
        { id: 'screen-13', label: '13" and above', value: 13, count: 0 },
      ],
      icon: '📱',
    },
    {
      id: 'storage',
      label: 'Storage',
      type: 'checkbox',
      options: [
        { id: 'storage-32gb', label: '32 GB', value: 32, count: 0 },
        { id: 'storage-64gb', label: '64 GB', value: 64, count: 0 },
        { id: 'storage-128gb', label: '128 GB', value: 128, count: 0 },
        { id: 'storage-256gb', label: '256 GB', value: 256, count: 0 },
        { id: 'storage-512gb', label: '512 GB+', value: 512, count: 0 },
      ],
      icon: '💿',
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      type: 'checkbox',
      options: [
        { id: 'wifi-only', label: 'Wi-Fi Only', value: 'wifi', count: 0 },
        { id: 'wifi-cellular', label: 'Wi-Fi + Cellular', value: 'wifi-cellular', count: 0 },
      ],
      icon: '📡',
    },
  ];
}

/**
 * Audio/Headphone-specific filters
 */
function getAudioFilters(): FilterGroup[] {
  return [
    {
      id: 'type',
      label: 'Type',
      type: 'checkbox',
      options: [
        { id: 'over-ear', label: 'Over-Ear', value: 'over-ear', count: 0 },
        { id: 'on-ear', label: 'On-Ear', value: 'on-ear', count: 0 },
        { id: 'in-ear', label: 'In-Ear', value: 'in-ear', count: 0 },
        { id: 'earbuds', label: 'True Wireless Earbuds', value: 'earbuds', count: 0 },
      ],
      icon: '🎧',
    },
    {
      id: 'connectivity',
      label: 'Connectivity',
      type: 'checkbox',
      options: [
        { id: 'wireless', label: 'Wireless (Bluetooth)', value: 'wireless', count: 0 },
        { id: 'wired', label: 'Wired', value: 'wired', count: 0 },
        { id: 'hybrid', label: 'Wired + Wireless', value: 'hybrid', count: 0 },
      ],
      icon: '📡',
    },
    {
      id: 'features',
      label: 'Features',
      type: 'checkbox',
      options: [
        { id: 'anc', label: 'Active Noise Cancellation', value: 'anc', count: 0 },
        { id: 'microphone', label: 'Built-in Microphone', value: 'microphone', count: 0 },
        { id: 'water-resistant', label: 'Water Resistant', value: 'water-resistant', count: 0 },
      ],
      icon: '✨',
    },
  ];
}

/**
 * Smartwatch-specific filters
 */
function getWatchFilters(): FilterGroup[] {
  return [
    {
      id: 'features',
      label: 'Features',
      type: 'checkbox',
      options: [
        { id: 'fitness-tracking', label: 'Fitness Tracking', value: 'fitness', count: 0 },
        { id: 'heart-rate', label: 'Heart Rate Monitor', value: 'heart-rate', count: 0 },
        { id: 'gps', label: 'GPS', value: 'gps', count: 0 },
        { id: 'water-resistant', label: 'Water Resistant', value: 'water-resistant', count: 0 },
        { id: 'cellular', label: 'Cellular Connectivity', value: 'cellular', count: 0 },
      ],
      icon: '⌚',
    },
    {
      id: 'compatibility',
      label: 'Compatibility',
      type: 'checkbox',
      options: [
        { id: 'ios', label: 'iOS', value: 'ios', count: 0 },
        { id: 'android', label: 'Android', value: 'android', count: 0 },
        { id: 'both', label: 'iOS & Android', value: 'both', count: 0 },
      ],
      icon: '📱',
    },
  ];
}

/**
 * Accessory-specific filters
 */
function getAccessoryFilters(): FilterGroup[] {
  return [
    {
      id: 'type',
      label: 'Type',
      type: 'checkbox',
      options: [
        { id: 'case', label: 'Cases & Covers', value: 'case', count: 0 },
        { id: 'charger', label: 'Chargers & Cables', value: 'charger', count: 0 },
        { id: 'screen-protector', label: 'Screen Protectors', value: 'screen-protector', count: 0 },
        { id: 'power-bank', label: 'Power Banks', value: 'power-bank', count: 0 },
        { id: 'adapter', label: 'Adapters', value: 'adapter', count: 0 },
      ],
      icon: '🎒',
    },
    {
      id: 'compatibility',
      label: 'Compatible With',
      type: 'checkbox',
      options: [
        { id: 'iphone', label: 'iPhone', value: 'iphone', count: 0 },
        { id: 'samsung', label: 'Samsung', value: 'samsung', count: 0 },
        { id: 'universal', label: 'Universal', value: 'universal', count: 0 },
      ],
      icon: '🔌',
    },
  ];
}

/**
 * Update filter counts based on current product set
 */
export function updateFilterCounts(
  filters: FilterGroup[],
  products: Array<{ metadata?: Record<string, string>; name: string }>
): FilterGroup[] {
  return filters.map((filterGroup) => {
    if (!filterGroup.options) return filterGroup;

    const updatedOptions = filterGroup.options.map((option) => {
      const count = products.filter((product) => {
        return matchesFilter(product, filterGroup.id, option.value);
      }).length;

      return { ...option, count };
    });

    return { ...filterGroup, options: updatedOptions };
  });
}

/**
 * Check if a product matches a filter
 */
function matchesFilter(
  product: { metadata?: Record<string, string>; name: string },
  filterId: string,
  filterValue: string | number
): boolean {
  const metadata = product.metadata || {};
  const name = product.name.toLowerCase();

  switch (filterId) {
    case 'brand':
      return name.includes(String(filterValue).toLowerCase());

    case 'processor':
      const processor = metadata.processor || '';
      return processor.toLowerCase().includes(String(filterValue).toLowerCase());

    case 'ram':
      const ram = parseInt(metadata.ram || '0');
      return ram >= Number(filterValue);

    case 'storage':
      const storage = parseInt(metadata.storage || '0');
      return storage >= Number(filterValue);

    case 'screen-size':
      const screenSize = parseFloat(metadata.screen_size || '0');
      return screenSize >= Number(filterValue);

    default:
      return false;
  }
}

/**
 * Apply filters to product list
 */
export function applyFilters<T extends { metadata?: Record<string, string>; name: string; pricing?: any }>(
  products: T[],
  selectedFilters: Record<string, (string | number)[]>
): T[] {
  return products.filter((product) => {
    for (const [filterId, values] of Object.entries(selectedFilters)) {
      if (values.length === 0) continue;

      // Price range filter
      if (filterId === 'price') {
        const price = product.pricing?.priceRange?.start?.gross?.amount || 0;
        const [min, max] = values as number[];
        if (price < min || price > max) return false;
        continue;
      }

      // Check if product matches any of the selected values
      const matches = values.some((value) => matchesFilter(product, filterId, value));
      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Get filter preset configurations
 */
export function getFilterPresets(categorySlug: string): Array<{ id: string; label: string; filters: Record<string, (string | number)[]> }> {
  const lowerSlug = categorySlug.toLowerCase();

  if (lowerSlug.includes('laptop')) {
    return [
      {
        id: 'gaming',
        label: '🎮 Gaming Laptops',
        filters: {
          ram: [16, 32],
          graphics: ['nvidia-rtx', 'nvidia-gtx'],
          processor: ['intel-i7', 'intel-i9', 'amd-ryzen-7', 'amd-ryzen-9'],
        },
      },
      {
        id: 'professional',
        label: '💼 Professional',
        filters: {
          ram: [16, 32],
          processor: ['intel-i7', 'intel-i9', 'amd-ryzen-7', 'apple-silicon'],
          'screen-size': [14, 15],
        },
      },
      {
        id: 'budget',
        label: '💰 Budget Friendly',
        filters: {
          ram: [4, 8],
          processor: ['intel-i3', 'intel-i5', 'amd-ryzen-5'],
          price: [0, 2000000], // Up to 2M UGX
        },
      },
    ];
  }

  if (lowerSlug.includes('phone')) {
    return [
      {
        id: 'flagship',
        label: '🏆 Flagship Phones',
        filters: {
          ram: [8, 12],
          storage: [256, 512],
          camera: [64, 108],
          '5g': ['yes'],
        },
      },
      {
        id: 'mid-range',
        label: '⭐ Mid-Range',
        filters: {
          ram: [6, 8],
          storage: [128, 256],
          price: [800000, 2500000], // 800K - 2.5M UGX
        },
      },
      {
        id: 'budget',
        label: '💰 Budget Phones',
        filters: {
          ram: [3, 4, 6],
          storage: [64, 128],
          price: [0, 800000], // Up to 800K UGX
        },
      },
    ];
  }

  return [];
}
