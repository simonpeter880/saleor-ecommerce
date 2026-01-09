const fetch = require('node-fetch');

const SALEOR_API_URL = 'https://techhub.eu.saleor.cloud/graphql/';

// First, we need to create a category
const createCategoryMutation = `
  mutation CreateCategory {
    categoryCreate(input: {
      name: "Smartphones"
      slug: "smartphones"
      description: "Latest smartphones and mobile devices"
    }) {
      category {
        id
        name
        slug
      }
      errors {
        field
        message
      }
    }
  }
`;

// Create product type if needed
const createProductTypeMutation = `
  mutation CreateProductType {
    productTypeCreate(input: {
      name: "Electronics"
      slug: "electronics"
      hasVariants: false
      isShippingRequired: true
      weight: 0
    }) {
      productType {
        id
        name
      }
      errors {
        field
        message
      }
    }
  }
`;

// Create the product
const createProductMutation = `
  mutation CreateProduct($categoryId: ID!, $productTypeId: ID!) {
    productCreate(input: {
      name: "Samsung Galaxy S24 Ultra"
      slug: "samsung-galaxy-s24-ultra"
      description: "🔥 Premium flagship smartphone with cutting-edge features!\\n\\n✨ Key Features:\\n• 6.8\\" Dynamic AMOLED 2X display\\n• 200MP main camera with AI zoom\\n• Snapdragon 8 Gen 3 processor\\n• 12GB RAM / 256GB storage\\n• 5000mAh battery with fast charging\\n• IP68 water & dust resistance\\n• S Pen included\\n\\n📦 What's in the box:\\n• Samsung Galaxy S24 Ultra\\n• S Pen\\n• USB-C cable\\n• Ejection pin\\n• Quick start guide\\n\\n🚚 Free delivery in Kampala!\\n🛡️ 1-year warranty included"
      category: $categoryId
      productType: $productTypeId
      weight: 0.233
    }) {
      product {
        id
        name
        slug
      }
      errors {
        field
        message
      }
    }
  }
`;

// Create product variant with price
const createVariantMutation = `
  mutation CreateVariant($productId: ID!) {
    productVariantCreate(input: {
      product: $productId
      sku: "SAMS24U-256-BLK"
      trackInventory: true
      weight: 0.233
      stocks: {
        warehouse: "warehouse-id"
        quantity: 10
      }
    }) {
      productVariant {
        id
        sku
      }
      errors {
        field
        message
      }
    }
  }
`;

// Set channel listing (price)
const updateChannelListingMutation = `
  mutation UpdateChannelListing($productId: ID!) {
    productChannelListingUpdate(id: $productId, input: {
      updateChannels: {
        channelId: "Q2hhbm5lbDoy"
        isPublishedAt: null
        publishedAt: null
        visibleInListings: true
        isAvailableForPurchase: true
        availableForPurchaseAt: null
      }
    }) {
      product {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

async function createProduct() {
  try {
    console.log('🚀 Creating product in Saleor Cloud...\n');

    // Step 1: Create Category
    console.log('📁 Creating category "Smartphones"...');
    const categoryResponse = await fetch(SALEOR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: createCategoryMutation })
    });
    const categoryData = await categoryResponse.json();

    if (categoryData.errors) {
      console.error('Category errors:', categoryData.errors);
      return;
    }

    const categoryId = categoryData.data.categoryCreate.category?.id;
    console.log('✅ Category created:', categoryId);

    // Step 2: Create Product Type
    console.log('\n📦 Creating product type "Electronics"...');
    const productTypeResponse = await fetch(SALEOR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: createProductTypeMutation })
    });
    const productTypeData = await productTypeResponse.json();

    if (productTypeData.errors) {
      console.error('Product type errors:', productTypeData.errors);
      return;
    }

    const productTypeId = productTypeData.data.productTypeCreate.productType?.id;
    console.log('✅ Product type created:', productTypeId);

    // Step 3: Create Product
    console.log('\n📱 Creating Samsung Galaxy S24 Ultra...');
    const productResponse = await fetch(SALEOR_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: createProductMutation,
        variables: { categoryId, productTypeId }
      })
    });
    const productData = await productResponse.json();

    if (productData.errors) {
      console.error('Product errors:', productData.errors);
      return;
    }

    if (productData.data.productCreate.errors.length > 0) {
      console.error('Product creation errors:', productData.data.productCreate.errors);
      return;
    }

    const productId = productData.data.productCreate.product?.id;
    console.log('✅ Product created:', productData.data.productCreate.product);

    console.log('\n🎉 SUCCESS! Product added to your store!');
    console.log('\n📍 View it at: http://localhost:3000/default-channel/products/samsung-galaxy-s24-ultra');
    console.log('📍 Dashboard: https://techhub.eu.saleor.cloud/dashboard/products/');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProduct();
