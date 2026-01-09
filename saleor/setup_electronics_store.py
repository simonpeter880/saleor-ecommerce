"""
Script to configure Saleor for electronics-only e-commerce.
This script will:
1. Update shop settings
2. Create electronics-specific product types and attributes
3. Remove non-electronics categories and products
"""

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "saleor.settings")
django.setup()

from django.db import transaction
from saleor.site.models import Site, SiteSettings
from saleor.product.models import ProductType, Category, Product
from saleor.attribute.models import Attribute, AttributeValue, AttributeProduct

def update_shop_settings():
    """Update shop name and description for electronics store"""
    print("Updating shop settings...")
    site = Site.objects.get_current()
    site.name = "TechHub Electronics"
    site.save()

    settings = SiteSettings.objects.get(site=site)
    settings.header_text = "TechHub Electronics"
    settings.save()
    print("✓ Shop settings updated")

def create_electronics_attributes():
    """Create electronics-specific attributes"""
    print("\nCreating electronics attributes...")

    # Brand attribute
    brand_attr, created = Attribute.objects.get_or_create(
        slug="brand",
        defaults={
            "name": "Brand",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        brands = ["Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "Microsoft",
                 "Google", "Asus", "Acer", "Razer", "Nintendo", "PlayStation", "Xbox"]
        for brand in brands:
            AttributeValue.objects.get_or_create(
                attribute=brand_attr,
                slug=brand.lower(),
                defaults={"name": brand}
            )
        print("✓ Brand attribute created")

    # Screen Size attribute
    screen_attr, created = Attribute.objects.get_or_create(
        slug="screen-size",
        defaults={
            "name": "Screen Size",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        sizes = ["5-6 inches", "6-7 inches", "13-14 inches", "15-16 inches", "17+ inches",
                "24 inches", "27 inches", "32 inches", "40+ inches"]
        for size in sizes:
            AttributeValue.objects.get_or_create(
                attribute=screen_attr,
                slug=size.lower().replace(" ", "-").replace("+", "plus"),
                defaults={"name": size}
            )
        print("✓ Screen Size attribute created")

    # Storage Capacity attribute
    storage_attr, created = Attribute.objects.get_or_create(
        slug="storage",
        defaults={
            "name": "Storage Capacity",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        capacities = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"]
        for capacity in capacities:
            AttributeValue.objects.get_or_create(
                attribute=storage_attr,
                slug=capacity.lower(),
                defaults={"name": capacity}
            )
        print("✓ Storage Capacity attribute created")

    # RAM attribute
    ram_attr, created = Attribute.objects.get_or_create(
        slug="ram",
        defaults={
            "name": "RAM",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        ram_options = ["4GB", "8GB", "16GB", "32GB", "64GB"]
        for ram in ram_options:
            AttributeValue.objects.get_or_create(
                attribute=ram_attr,
                slug=ram.lower(),
                defaults={"name": ram}
            )
        print("✓ RAM attribute created")

    # Processor attribute
    processor_attr, created = Attribute.objects.get_or_create(
        slug="processor",
        defaults={
            "name": "Processor",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        processors = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9",
                     "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9",
                     "Apple M1", "Apple M2", "Apple M3"]
        for proc in processors:
            AttributeValue.objects.get_or_create(
                attribute=processor_attr,
                slug=proc.lower().replace(" ", "-"),
                defaults={"name": proc}
            )
        print("✓ Processor attribute created")

    # Color attribute
    color_attr, created = Attribute.objects.get_or_create(
        slug="color",
        defaults={
            "name": "Color",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        colors = ["Black", "White", "Silver", "Space Gray", "Gold", "Blue", "Red", "Green"]
        for color in colors:
            AttributeValue.objects.get_or_create(
                attribute=color_attr,
                slug=color.lower().replace(" ", "-"),
                defaults={"name": color}
            )
        print("✓ Color attribute created")

    # Warranty attribute
    warranty_attr, created = Attribute.objects.get_or_create(
        slug="warranty",
        defaults={
            "name": "Warranty",
            "type": "PRODUCT_TYPE",
            "input_type": "DROPDOWN",
        }
    )
    if created:
        warranties = ["1 Year", "2 Years", "3 Years"]
        for warranty in warranties:
            AttributeValue.objects.get_or_create(
                attribute=warranty_attr,
                slug=warranty.lower().replace(" ", "-"),
                defaults={"name": warranty}
            )
        print("✓ Warranty attribute created")

def create_electronics_product_types():
    """Create product types for electronics categories"""
    print("\nCreating electronics product types...")

    # Get all attributes
    brand = Attribute.objects.get(slug="brand")
    color = Attribute.objects.get(slug="color")
    warranty = Attribute.objects.get(slug="warranty")
    storage = Attribute.objects.get(slug="storage")
    ram = Attribute.objects.get(slug="ram")
    processor = Attribute.objects.get(slug="processor")
    screen_size = Attribute.objects.get(slug="screen-size")

    # Smartphone Product Type
    smartphone_type, created = ProductType.objects.get_or_create(
        slug="smartphone",
        defaults={
            "name": "Smartphone",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    if created:
        smartphone_type.product_attributes.add(brand, screen_size, storage, color, warranty)
        print("✓ Smartphone product type created")

    # Laptop Product Type
    laptop_type, created = ProductType.objects.get_or_create(
        slug="laptop",
        defaults={
            "name": "Laptop",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    if created:
        laptop_type.product_attributes.add(brand, screen_size, storage, ram, processor, color, warranty)
        print("✓ Laptop product type created")

    # Tablet Product Type
    tablet_type, created = ProductType.objects.get_or_create(
        slug="tablet",
        defaults={
            "name": "Tablet",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    if created:
        tablet_type.product_attributes.add(brand, screen_size, storage, color, warranty)
        print("✓ Tablet product type created")

    # Gaming Console Product Type
    console_type, created = ProductType.objects.get_or_create(
        slug="gaming-console",
        defaults={
            "name": "Gaming Console",
            "has_variants": True,
            "is_shipping_required": True,
        }
    )
    if created:
        console_type.product_attributes.add(brand, storage, color, warranty)
        print("✓ Gaming Console product type created")

    # Smart Home Device Product Type
    smart_home_type, created = ProductType.objects.get_or_create(
        slug="smart-home",
        defaults={
            "name": "Smart Home Device",
            "has_variants": False,
            "is_shipping_required": True,
        }
    )
    if created:
        smart_home_type.product_attributes.add(brand, color, warranty)
        print("✓ Smart Home product type created")

    # Accessories Product Type
    accessory_type, created = ProductType.objects.get_or_create(
        slug="accessory",
        defaults={
            "name": "Accessory",
            "has_variants": False,
            "is_shipping_required": True,
        }
    )
    if created:
        accessory_type.product_attributes.add(brand, color, warranty)
        print("✓ Accessory product type created")

def create_electronics_categories():
    """Create electronics categories"""
    print("\nCreating electronics categories...")

    # Get or create root category
    root_category, created = Category.objects.get_or_create(
        slug="electronics",
        defaults={
            "name": "Electronics",
        }
    )
    if created:
        print("✓ Root 'Electronics' category created")

    categories = [
        ("smartphones", "Smartphones & Mobile Devices"),
        ("laptops", "Laptops & Computers"),
        ("tablets", "Tablets & E-Readers"),
        ("gaming", "Gaming Consoles & Accessories"),
        ("smart-home", "Smart Home Devices"),
        ("audio", "Audio & Headphones"),
        ("wearables", "Wearables & Fitness"),
        ("accessories", "Accessories & Cables"),
    ]

    for slug, name in categories:
        category, created = Category.objects.get_or_create(
            slug=slug,
            defaults={
                "name": name,
                "parent": root_category,
            }
        )
        if created:
            print(f"✓ Category '{name}' created")

@transaction.atomic
def main():
    print("=" * 60)
    print("CONFIGURING SALEOR FOR ELECTRONICS STORE")
    print("=" * 60)

    update_shop_settings()
    create_electronics_attributes()
    create_electronics_product_types()
    create_electronics_categories()

    print("\n" + "=" * 60)
    print("✓ Electronics store configuration complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Remove or update existing sample products")
    print("2. Add electronics products via Django admin or GraphQL")
    print("3. Configure shipping methods for electronics")
    print("4. Update product images and descriptions")

if __name__ == "__main__":
    main()
