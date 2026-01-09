#!/usr/bin/env python
"""
Add sample electronics products to TechHub Electronics store
"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "saleor.settings")
django.setup()

from decimal import Decimal
from django.db import transaction
from saleor.product.models import Product, ProductType, Category, ProductVariant, ProductChannelListing, ProductVariantChannelListing
from saleor.channel.models import Channel
from saleor.attribute.models import Attribute, AttributeValue

@transaction.atomic
def create_sample_products():
    """Create sample electronics products"""
    print("=" * 60)
    print("ADDING SAMPLE ELECTRONICS PRODUCTS")
    print("=" * 60)

    # Get the default channel
    try:
        channel = Channel.objects.get(slug="default-channel")
    except Channel.DoesNotExist:
        print("❌ Default channel not found. Please run migrations first.")
        return

    # Get categories
    smartphones = Category.objects.filter(slug="smartphones").first()
    laptops = Category.objects.filter(slug="laptops").first()
    tablets = Category.objects.filter(slug="tablets").first()
    gaming = Category.objects.filter(slug="gaming").first()

    # Get product types
    smartphone_type = ProductType.objects.filter(slug="smartphone").first()
    laptop_type = ProductType.objects.filter(slug="laptop").first()
    tablet_type = ProductType.objects.filter(slug="tablet").first()
    gaming_type = ProductType.objects.filter(slug="gaming-console").first()

    # Sample products data
    products_data = [
        # Smartphones
        {
            "name": "iPhone 15 Pro",
            "slug": "iphone-15-pro",
            "description": "The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system. Experience pro performance and photography.",
            "category": smartphones,
            "product_type": smartphone_type,
            "price": Decimal("999.00"),
            "variants": [
                {"name": "128GB - Natural Titanium", "sku": "IP15P-128-NT", "price": Decimal("999.00")},
                {"name": "256GB - Natural Titanium", "sku": "IP15P-256-NT", "price": Decimal("1099.00")},
                {"name": "512GB - Natural Titanium", "sku": "IP15P-512-NT", "price": Decimal("1299.00")},
            ]
        },
        {
            "name": "Samsung Galaxy S24 Ultra",
            "slug": "samsung-galaxy-s24-ultra",
            "description": "Galaxy AI is here. The most intelligent Galaxy yet with advanced AI features, stunning 200MP camera, and S Pen.",
            "category": smartphones,
            "product_type": smartphone_type,
            "price": Decimal("1199.00"),
            "variants": [
                {"name": "256GB - Titanium Gray", "sku": "S24U-256-TG", "price": Decimal("1199.00")},
                {"name": "512GB - Titanium Gray", "sku": "S24U-512-TG", "price": Decimal("1319.00")},
            ]
        },
        {
            "name": "Google Pixel 8 Pro",
            "slug": "google-pixel-8-pro",
            "description": "Google AI, Pixel perfection. Advanced AI features, amazing camera, and pure Android experience.",
            "category": smartphones,
            "product_type": smartphone_type,
            "price": Decimal("899.00"),
            "variants": [
                {"name": "128GB - Obsidian", "sku": "P8P-128-OB", "price": Decimal("899.00")},
                {"name": "256GB - Obsidian", "sku": "P8P-256-OB", "price": Decimal("999.00")},
            ]
        },

        # Laptops
        {
            "name": "MacBook Pro 16-inch M3 Pro",
            "slug": "macbook-pro-16-m3-pro",
            "description": "Supercharged by M3 Pro. Up to 18 hours battery life. Liquid Retina XDR display. The ultimate pro laptop.",
            "category": laptops,
            "product_type": laptop_type,
            "price": Decimal("2499.00"),
            "variants": [
                {"name": "18GB RAM / 512GB SSD - Space Black", "sku": "MBP16-M3P-18-512", "price": Decimal("2499.00")},
                {"name": "36GB RAM / 1TB SSD - Space Black", "sku": "MBP16-M3P-36-1TB", "price": Decimal("3499.00")},
            ]
        },
        {
            "name": "Dell XPS 15",
            "slug": "dell-xps-15",
            "description": "InfinityEdge display. Intel Core i7. NVIDIA GeForce RTX. Premium laptop for creators and professionals.",
            "category": laptops,
            "product_type": laptop_type,
            "price": Decimal("1799.00"),
            "variants": [
                {"name": "16GB RAM / 512GB SSD", "sku": "XPS15-16-512", "price": Decimal("1799.00")},
                {"name": "32GB RAM / 1TB SSD", "sku": "XPS15-32-1TB", "price": Decimal("2299.00")},
            ]
        },
        {
            "name": "ASUS ROG Zephyrus G16",
            "slug": "asus-rog-zephyrus-g16",
            "description": "Gaming laptop with Intel Core i9, NVIDIA RTX 4070, and 240Hz display. Slim, powerful, unstoppable.",
            "category": laptops,
            "product_type": laptop_type,
            "price": Decimal("2199.00"),
            "variants": [
                {"name": "32GB RAM / 1TB SSD", "sku": "ROG-G16-32-1TB", "price": Decimal("2199.00")},
            ]
        },

        # Tablets
        {
            "name": "iPad Pro 12.9-inch M2",
            "slug": "ipad-pro-129-m2",
            "description": "The ultimate iPad experience. M2 chip. Liquid Retina XDR display. Works with Apple Pencil and Magic Keyboard.",
            "category": tablets,
            "product_type": tablet_type,
            "price": Decimal("1099.00"),
            "variants": [
                {"name": "128GB - Space Gray", "sku": "IPP129-128-SG", "price": Decimal("1099.00")},
                {"name": "256GB - Space Gray", "sku": "IPP129-256-SG", "price": Decimal("1199.00")},
                {"name": "512GB - Space Gray", "sku": "IPP129-512-SG", "price": Decimal("1399.00")},
            ]
        },
        {
            "name": "Samsung Galaxy Tab S9 Ultra",
            "slug": "samsung-galaxy-tab-s9-ultra",
            "description": "Massive 14.6-inch display. S Pen included. IP68 water resistance. The ultimate Android tablet.",
            "category": tablets,
            "product_type": tablet_type,
            "price": Decimal("1199.00"),
            "variants": [
                {"name": "256GB - Graphite", "sku": "TABS9U-256-GR", "price": Decimal("1199.00")},
                {"name": "512GB - Graphite", "sku": "TABS9U-512-GR", "price": Decimal("1399.00")},
            ]
        },

        # Gaming Consoles
        {
            "name": "PlayStation 5",
            "slug": "playstation-5",
            "description": "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, and stunning visuals.",
            "category": gaming,
            "product_type": gaming_type,
            "price": Decimal("499.00"),
            "variants": [
                {"name": "Standard Edition", "sku": "PS5-STD", "price": Decimal("499.00")},
                {"name": "Digital Edition", "sku": "PS5-DIG", "price": Decimal("449.00")},
            ]
        },
        {
            "name": "Xbox Series X",
            "slug": "xbox-series-x",
            "description": "The fastest, most powerful Xbox ever. 12 teraflops of power. 4K gaming at 120fps. Quick Resume for multiple games.",
            "category": gaming,
            "product_type": gaming_type,
            "price": Decimal("499.00"),
            "variants": [
                {"name": "1TB", "sku": "XSX-1TB", "price": Decimal("499.00")},
            ]
        },
        {
            "name": "Nintendo Switch OLED",
            "slug": "nintendo-switch-oled",
            "description": "Vibrant 7-inch OLED screen. Enhanced audio. Wide adjustable stand. Dock with wired LAN port.",
            "category": gaming,
            "product_type": gaming_type,
            "price": Decimal("349.00"),
            "variants": [
                {"name": "White", "sku": "NSW-OLED-WH", "price": Decimal("349.00")},
                {"name": "Neon", "sku": "NSW-OLED-NE", "price": Decimal("349.00")},
            ]
        },
    ]

    created_count = 0

    for product_data in products_data:
        try:
            # Create product (without description to avoid JSON field issues)
            product, created = Product.objects.get_or_create(
                slug=product_data["slug"],
                defaults={
                    "name": product_data["name"],
                    "category": product_data["category"],
                    "product_type": product_data["product_type"],
                    "weight": 0.5,  # Default weight in kg
                }
            )

            # Set SEO description separately
            if created:
                product.seo_description = product_data["description"][:160]  # SEO limit
                product.save()

            if created:
                # Create product channel listing
                ProductChannelListing.objects.get_or_create(
                    product=product,
                    channel=channel,
                    defaults={
                        "is_published": True,
                        "visible_in_listings": True,
                    }
                )

                # Create variants
                for variant_data in product_data["variants"]:
                    variant, v_created = ProductVariant.objects.get_or_create(
                        product=product,
                        sku=variant_data["sku"],
                        defaults={
                            "name": variant_data["name"],
                            "track_inventory": True,
                        }
                    )

                    if v_created:
                        # Create variant channel listing with price
                        ProductVariantChannelListing.objects.get_or_create(
                            variant=variant,
                            channel=channel,
                            defaults={
                                "price_amount": variant_data["price"],
                                "currency": "USD",
                            }
                        )

                created_count += 1
                print(f"✓ Created product: {product.name}")
            else:
                print(f"  Product already exists: {product.name}")

        except Exception as e:
            print(f"❌ Error creating {product_data['name']}: {e}")
            continue

    print("\n" + "=" * 60)
    print(f"✓ Successfully created {created_count} new products!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Add product images via Django admin")
    print("2. Configure stock levels")
    print("3. Test products on storefront")
    print("")

if __name__ == "__main__":
    create_sample_products()
