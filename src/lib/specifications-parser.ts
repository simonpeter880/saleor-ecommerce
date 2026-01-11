/**
 * Specifications Parser
 *
 * Parses product metadata from Saleor into structured specifications
 * for display in specification tables
 */

export interface ProductSpec {
  category: string;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

export interface ParsedSpecifications {
  general: ProductSpec;
  technical?: ProductSpec;
  physical?: ProductSpec;
  warranty?: ProductSpec;
}

/**
 * Parse product metadata into structured specifications
 * Saleor stores custom attributes in product.metadata
 */
export function parseProductSpecifications(
  metadata: Record<string, string>,
  productType?: string
): ParsedSpecifications {
  const specs: ParsedSpecifications = {
    general: {
      category: 'General',
      specs: [],
    },
  };

  // Product type specific parsing
  switch (productType?.toLowerCase()) {
    case 'smartphone':
    case 'phone':
      return parseSmartphoneSpecs(metadata);
    case 'laptop':
    case 'notebook':
      return parseLaptopSpecs(metadata);
    case 'tablet':
      return parseTabletSpecs(metadata);
    default:
      return parseGenericSpecs(metadata);
  }
}

function parseSmartphoneSpecs(metadata: Record<string, string>): ParsedSpecifications {
  return {
    general: {
      category: 'General',
      specs: [
        { label: 'Brand', value: metadata.brand || 'N/A' },
        { label: 'Model', value: metadata.model || 'N/A' },
        { label: 'Release Date', value: metadata.releaseDate || 'N/A' },
        { label: 'Operating System', value: metadata.os || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    technical: {
      category: 'Technical Specifications',
      specs: [
        { label: 'Display', value: metadata.displaySize ? `${metadata.displaySize}" ${metadata.displayType || ''}` : 'N/A' },
        { label: 'Resolution', value: metadata.resolution || 'N/A' },
        { label: 'Processor', value: metadata.processor || 'N/A' },
        { label: 'RAM', value: metadata.ram || 'N/A' },
        { label: 'Storage', value: metadata.storage || 'N/A' },
        { label: 'Camera', value: metadata.camera ? `${metadata.camera} MP` : 'N/A' },
        { label: 'Front Camera', value: metadata.frontCamera ? `${metadata.frontCamera} MP` : 'N/A' },
        { label: 'Battery', value: metadata.battery ? `${metadata.battery} mAh` : 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    physical: {
      category: 'Physical',
      specs: [
        { label: 'Dimensions', value: metadata.dimensions || 'N/A' },
        { label: 'Weight', value: metadata.weight ? `${metadata.weight}g` : 'N/A' },
        { label: 'Colors', value: metadata.colors || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    warranty: {
      category: 'Warranty & Support',
      specs: [
        { label: 'Warranty', value: metadata.warranty || '1 Year Manufacturer Warranty' },
        { label: 'Warranty Type', value: metadata.warrantyType || 'Limited Hardware Warranty' },
      ],
    },
  };
}

function parseLaptopSpecs(metadata: Record<string, string>): ParsedSpecifications {
  return {
    general: {
      category: 'General',
      specs: [
        { label: 'Brand', value: metadata.brand || 'N/A' },
        { label: 'Model', value: metadata.model || 'N/A' },
        { label: 'Series', value: metadata.series || 'N/A' },
        { label: 'Operating System', value: metadata.os || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    technical: {
      category: 'Technical Specifications',
      specs: [
        { label: 'Processor', value: metadata.processor || 'N/A' },
        { label: 'Processor Generation', value: metadata.processorGen || 'N/A' },
        { label: 'RAM', value: metadata.ram || 'N/A' },
        { label: 'Storage Type', value: metadata.storageType || 'N/A' },
        { label: 'Storage Capacity', value: metadata.storage || 'N/A' },
        { label: 'Display Size', value: metadata.displaySize ? `${metadata.displaySize}"` : 'N/A' },
        { label: 'Display Resolution', value: metadata.resolution || 'N/A' },
        { label: 'Graphics Card', value: metadata.gpu || 'N/A' },
        { label: 'Graphics Memory', value: metadata.vram || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    physical: {
      category: 'Physical & Connectivity',
      specs: [
        { label: 'Dimensions', value: metadata.dimensions || 'N/A' },
        { label: 'Weight', value: metadata.weight ? `${metadata.weight} kg` : 'N/A' },
        { label: 'Battery Life', value: metadata.batteryLife || 'N/A' },
        { label: 'Ports', value: metadata.ports || 'N/A' },
        { label: 'WiFi', value: metadata.wifi || 'N/A' },
        { label: 'Bluetooth', value: metadata.bluetooth || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    warranty: {
      category: 'Warranty & Support',
      specs: [
        { label: 'Warranty', value: metadata.warranty || '1 Year Manufacturer Warranty' },
        { label: 'Warranty Type', value: metadata.warrantyType || 'Limited Hardware Warranty' },
      ],
    },
  };
}

function parseTabletSpecs(metadata: Record<string, string>): ParsedSpecifications {
  return {
    general: {
      category: 'General',
      specs: [
        { label: 'Brand', value: metadata.brand || 'N/A' },
        { label: 'Model', value: metadata.model || 'N/A' },
        { label: 'Operating System', value: metadata.os || 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    technical: {
      category: 'Technical Specifications',
      specs: [
        { label: 'Display Size', value: metadata.displaySize ? `${metadata.displaySize}"` : 'N/A' },
        { label: 'Resolution', value: metadata.resolution || 'N/A' },
        { label: 'Processor', value: metadata.processor || 'N/A' },
        { label: 'RAM', value: metadata.ram || 'N/A' },
        { label: 'Storage', value: metadata.storage || 'N/A' },
        { label: 'Camera', value: metadata.camera ? `${metadata.camera} MP` : 'N/A' },
        { label: 'Battery', value: metadata.battery ? `${metadata.battery} mAh` : 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    physical: {
      category: 'Physical',
      specs: [
        { label: 'Dimensions', value: metadata.dimensions || 'N/A' },
        { label: 'Weight', value: metadata.weight ? `${metadata.weight}g` : 'N/A' },
      ].filter(spec => spec.value !== 'N/A'),
    },
    warranty: {
      category: 'Warranty & Support',
      specs: [
        { label: 'Warranty', value: metadata.warranty || '1 Year Manufacturer Warranty' },
      ],
    },
  };
}

function parseGenericSpecs(metadata: Record<string, string>): ParsedSpecifications {
  const specs: ParsedSpecifications = {
    general: {
      category: 'Product Information',
      specs: [],
    },
  };

  // Convert all metadata to specs
  Object.entries(metadata).forEach(([key, value]) => {
    if (value && value !== 'N/A') {
      specs.general.specs.push({
        label: formatLabel(key),
        value: value,
      });
    }
  });

  return specs;
}

/**
 * Format metadata key into human-readable label
 */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

/**
 * Get warranty information from metadata or defaults
 */
export function getWarrantyInfo(metadata: Record<string, string>) {
  return {
    duration: metadata.warranty || '1 Year',
    type: metadata.warrantyType || 'Manufacturer Limited Warranty',
    coverage: metadata.warrantyCoverage || 'Hardware defects and malfunctions',
    support: metadata.support || '24/7 Customer Support',
  };
}

/**
 * Get return policy information
 */
export function getReturnPolicy() {
  return {
    period: '30 Days',
    condition: 'Original packaging and unused condition',
    process: 'Free return shipping for defective items',
    refund: 'Full refund within 5-7 business days',
  };
}
