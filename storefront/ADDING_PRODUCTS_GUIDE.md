# TechHub Electronics - Adding Products Guide

## 🎯 Overview
This guide shows you how to add products to your TechHub Electronics store using Saleor.

---

## Method 1: Saleor Cloud (Recommended - Easiest)

### Step 1: Create Saleor Cloud Account
1. Go to **https://cloud.saleor.io/**
2. Sign up for a free account
3. Click "Create New Environment"
4. Choose your region (closest to Uganda)
5. Wait for instance to be created (~2 minutes)

### Step 2: Get Your API URL
1. Once created, click on your environment
2. Copy the **GraphQL API URL** (looks like: `https://your-name.saleor.cloud/graphql/`)
3. Copy the **Dashboard URL** (looks like: `https://your-name.saleor.cloud/dashboard/`)

### Step 3: Update Your Storefront
1. Open `/home/cymo/projects/storefront/.env`
2. Update this line:
```bash
NEXT_PUBLIC_SALEOR_API_URL=https://your-name.saleor.cloud/graphql/
```
3. Save and restart your dev server

### Step 4: Access Dashboard
1. Go to your Dashboard URL
2. Login with your Saleor Cloud credentials
3. You're ready to add products!

---

## Method 2: Local Saleor Backend (Advanced)

### Step 1: Clone Saleor
```bash
cd /home/cymo/projects
git clone https://github.com/saleor/saleor-platform.git
cd saleor-platform
```

### Step 2: Start Saleor
```bash
docker-compose up -d
```

This will start:
- Saleor API on `http://localhost:8000`
- Saleor Dashboard on `http://localhost:9000`
- PostgreSQL database
- Redis cache
- Worker processes

### Step 3: Create Admin User
```bash
docker-compose exec api python manage.py createsuperuser
```

Follow prompts to create your admin account.

### Step 4: Populate Sample Data (Optional)
```bash
docker-compose exec api python manage.py populatedb
```

This adds sample products to test with.

---

## Adding Products via Dashboard

### Access Dashboard
- **Cloud**: `https://your-name.saleor.cloud/dashboard/`
- **Local**: `http://localhost:9000`

### Login
Use the credentials you created

### Add a Product

#### 1. Navigate to Products
- Click **Catalog** in left sidebar
- Click **Products**
- Click **Create Product** button

#### 2. Fill Product Information

**General Information**:
- **Product Name**: e.g., "Samsung Galaxy S24 Ultra"
- **Description**: Full product description (supports rich text)
- **Category**: Select or create (e.g., "Smartphones")

**Pricing**:
- **Price**: Enter in UGX (e.g., 4500000 for UGX 4,500,000)
- **Compare at price**: Original price if on sale
- **Cost per item**: Your cost (optional, for profit tracking)

**Inventory**:
- **SKU**: Stock Keeping Unit (e.g., "SAMS24U-BLK-256")
- **Quantity**: How many in stock
- **Track inventory**: Toggle on to manage stock

**Variants** (for products with options):
- Click **Add Variant**
- Add options like:
  - Color: Black, White, Gray
  - Storage: 128GB, 256GB, 512GB
  - Size: Small, Medium, Large
- Set price and stock for each variant

**Media**:
- Click **Upload** to add product images
- Add multiple images (recommended: 4-6 images)
- First image becomes the thumbnail
- Reorder by dragging

**SEO**:
- **SEO Title**: For search engines
- **SEO Description**: Meta description
- **Slug**: URL-friendly name (auto-generated)

**Shipping**:
- **Weight**: Product weight (for shipping calculation)
- **Requires shipping**: Toggle if physical product

**Organization**:
- **Product Type**: Select or create (e.g., "Electronics")
- **Collections**: Add to collections (e.g., "Featured", "Best Sellers")
- **Tags**: Add searchable tags

#### 3. Save Product
- Click **Save** button (top right)
- Product is now live on your storefront!

---

## Quick Product Examples for TechHub

### Example 1: Smartphone
```
Name: Samsung Galaxy S24 Ultra
Category: Smartphones
Price: UGX 4,500,000
Description:
The ultimate flagship smartphone with:
- 6.8" Dynamic AMOLED display
- 200MP camera with AI zoom
- Snapdragon 8 Gen 3 processor
- 5000mAh battery with fast charging
- IP68 water resistance

SKU: SAMS24U-256-BLK
Stock: 15
Weight: 0.233 kg

Variants:
- 256GB Black - UGX 4,500,000
- 512GB Black - UGX 5,200,000
- 256GB White - UGX 4,500,000
```

### Example 2: Laptop
```
Name: MacBook Pro 14" M3
Category: Laptops
Price: UGX 8,500,000
Description:
Professional laptop with M3 chip:
- 14.2" Liquid Retina XDR display
- Apple M3 chip
- 16GB unified memory
- 512GB SSD storage
- 18-hour battery life

SKU: MBP14-M3-512-SG
Stock: 8
Weight: 1.55 kg

Variants:
- 16GB / 512GB - UGX 8,500,000
- 16GB / 1TB - UGX 10,200,000
```

### Example 3: Headphones
```
Name: Sony WH-1000XM5
Category: Audio
Price: UGX 1,800,000
Description:
Industry-leading noise cancellation:
- 30-hour battery life
- Premium sound quality
- Multipoint connection
- Touch controls
- Comfortable design

SKU: SONY-WH1000XM5-BLK
Stock: 25
Weight: 0.25 kg

Variants:
- Black - UGX 1,800,000
- Silver - UGX 1,850,000
```

---

## Bulk Import Products (Advanced)

### Using GraphQL Playground
1. Access GraphQL Playground: `http://localhost:8000/graphql`
2. Use `productCreate` mutation:

```graphql
mutation {
  productCreate(input: {
    name: "Product Name"
    slug: "product-slug"
    description: "Product description"
    category: "Q2F0ZWdvcnk6MQ=="
    productType: "UHJvZHVjdFR5cGU6MQ=="
  }) {
    product {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
```

### Using CSV Import (Coming in Saleor 3.x)
Future versions will support CSV bulk import.

### Using Saleor CLI
```bash
npm install -g @saleor/cli
saleor product create --name "Product Name" --price 100000
```

---

## Managing Inventory

### Update Stock Levels
1. Go to **Products** → Select product
2. Scroll to **Inventory** section
3. Update **Quantity**
4. Click **Save**

### Stock Alerts
Set up low stock alerts in Dashboard settings:
1. Go to **Configuration** → **Site Settings**
2. Set **Low stock threshold** (e.g., 5 units)
3. Get notified when stock is low

### Track Inventory
Enable inventory tracking per product:
- ✅ **Track inventory**: System prevents overselling
- ❌ **Don't track**: Unlimited stock (digital products)

---

## Product Categories

### Create Categories
1. Go to **Catalog** → **Categories**
2. Click **Create Category**
3. Enter details:
   - Name: "Smartphones"
   - Description: Category description
   - Parent: (optional, for subcategories)
   - SEO info
4. Click **Save**

### Suggested Categories for TechHub:
- 📱 Smartphones
- 💻 Laptops
- 🖥️ Computers & Desktops
- ⌨️ Accessories
- 🎧 Audio
- 📷 Cameras
- ⌚ Wearables
- 🎮 Gaming
- 🖨️ Printers & Scanners
- 📺 TVs & Monitors
- 🔌 Cables & Adapters
- 💾 Storage
- 🔋 Power & Batteries

---

## Product Collections

### Create Collections (Featured, Best Sellers, etc.)
1. Go to **Catalog** → **Collections**
2. Click **Create Collection**
3. Enter details:
   - Name: "Best Sellers"
   - Description: "Our top-selling products"
   - Products: Add products manually or with filters
4. Use on homepage for curated displays

### Suggested Collections:
- ⭐ Featured Products
- 🔥 Best Sellers
- 🆕 New Arrivals
- 💰 Deals & Discounts
- 🎁 Gift Ideas
- 🏆 Top Rated

---

## Product Attributes (Filters)

### Add Product Attributes
1. Go to **Catalog** → **Attributes**
2. Click **Create Attribute**
3. Examples:
   - **Brand**: Apple, Samsung, Sony, HP, Dell
   - **Screen Size**: 6.1", 6.7", 14", 15.6", 27"
   - **RAM**: 8GB, 16GB, 32GB, 64GB
   - **Storage**: 128GB, 256GB, 512GB, 1TB
   - **Color**: Black, White, Silver, Blue, Red
   - **Processor**: Intel i5, i7, i9, AMD Ryzen

### Apply Attributes
1. Edit product
2. Scroll to **Attributes**
3. Select values
4. Customers can filter by these on storefront

---

## SEO Best Practices

### Optimize Product Pages
1. **Title**: Include brand + model + key feature
   - ✅ "Samsung Galaxy S24 Ultra 256GB - 200MP Camera | TechHub"
   - ❌ "Phone 1"

2. **Description**: 150-160 characters
   - Include keywords: brand, model, features, price
   - Mention Uganda/Kampala for local SEO

3. **URL Slug**: Keep it clean
   - ✅ `samsung-galaxy-s24-ultra-256gb`
   - ❌ `product-12345-skuxxyz`

4. **Images**:
   - Use descriptive alt text
   - Optimize file size (< 200KB per image)
   - Use WebP format when possible

---

## Quick Start Checklist

- [ ] Set up Saleor Cloud or local backend
- [ ] Access Dashboard
- [ ] Create product categories
- [ ] Add your first product with:
  - [ ] Name and description
  - [ ] Price in UGX
  - [ ] At least 1 image
  - [ ] Stock quantity
  - [ ] Category assignment
- [ ] View product on storefront
- [ ] Create additional products
- [ ] Set up collections (Featured, Best Sellers)
- [ ] Configure shipping zones
- [ ] Test checkout process

---

## Troubleshooting

### Products Not Showing on Storefront?
1. **Check Channel**: Ensure product is assigned to "default-channel"
2. **Check Availability**: Product must be published (not draft)
3. **Check Stock**: Must have quantity > 0 (if tracking inventory)
4. **Check Category**: Ensure category is published
5. **Clear Cache**: Restart your Next.js dev server

### Can't Access Dashboard?
1. **Check Docker**: `docker ps` - dashboard should be running
2. **Check Port**: Try http://localhost:9000
3. **Check Credentials**: Reset password if needed
4. **Check Logs**: `docker logs devcontainer-dashboard-1`

### Images Not Displaying?
1. **Check Format**: Use JPG, PNG, or WebP
2. **Check Size**: Keep under 5MB per image
3. **Check Permissions**: Ensure media storage is writable
4. **Use CDN**: Consider Cloudinary or AWS S3 for production

---

## Need Help?

### Resources
- **Saleor Docs**: https://docs.saleor.io/
- **GraphQL Playground**: `http://localhost:8000/graphql`
- **Dashboard Guide**: https://docs.saleor.io/dashboard/
- **API Reference**: https://docs.saleor.io/api-reference/

### Support
- Saleor Discord: https://discord.gg/H52JTZAtSH
- GitHub Issues: https://github.com/saleor/saleor/issues
- Stack Overflow: Tag `saleor`

---

**Happy Selling! 🚀**

*TechHub Electronics - Uganda's Premier Electronics Store*
