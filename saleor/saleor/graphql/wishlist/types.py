import graphene
from graphene import relay

from ...wishlist import models
from ..core.connection import CountableConnection
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.scalars import DateTime
from ..core.types import ModelObjectType
from ..meta.types import ObjectWithMetadata
from ..product.types import Product, ProductVariant


class WishlistItem(ModelObjectType[models.WishlistItem]):
    """Represents an item in a user's wishlist."""

    id = graphene.GlobalID(required=True)
    product = graphene.Field(
        Product,
        required=True,
        description="The product added to wishlist.",
    )
    variant = graphene.Field(
        ProductVariant,
        description="The specific variant added to wishlist.",
    )
    created_at = DateTime(
        required=True,
        description="Date when item was added to wishlist.",
    )

    class Meta:
        description = "Represents an item in a user's wishlist."
        interfaces = [relay.Node]
        model = models.WishlistItem
        doc_category = DOC_CATEGORY_PRODUCTS

    @staticmethod
    def resolve_product(root: models.WishlistItem, info):
        return root.product

    @staticmethod
    def resolve_variant(root: models.WishlistItem, info):
        return root.variant


class WishlistItemCountableConnection(CountableConnection):
    class Meta:
        node = WishlistItem


class Wishlist(ModelObjectType[models.Wishlist]):
    """Represents a user's wishlist."""

    id = graphene.GlobalID(required=True)
    items = graphene.List(
        graphene.NonNull(WishlistItem),
        description="Items in the wishlist.",
    )
    item_count = graphene.Int(
        required=True,
        description="Total number of items in the wishlist.",
    )
    created_at = DateTime(
        required=True,
        description="Date when wishlist was created.",
    )
    updated_at = DateTime(
        required=True,
        description="Date when wishlist was last updated.",
    )

    class Meta:
        description = "Represents a user's wishlist for saving products."
        interfaces = [relay.Node, ObjectWithMetadata]
        model = models.Wishlist
        doc_category = DOC_CATEGORY_PRODUCTS

    @staticmethod
    def resolve_items(root: models.Wishlist, info):
        return root.items.all()

    @staticmethod
    def resolve_item_count(root: models.Wishlist, info):
        return root.items.count()
