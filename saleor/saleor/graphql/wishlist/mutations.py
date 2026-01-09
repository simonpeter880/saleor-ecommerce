import graphene
from django.core.exceptions import ValidationError

from ...wishlist import models
from ..core import ResolveInfo
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.mutations import BaseMutation
from ..core.types import BaseInputObjectType, NonNullList
from ..core.utils import from_global_id_or_error
from ..plugins.dataloaders import get_plugin_manager_promise
from .types import Wishlist, WishlistItem


class WishlistError(graphene.ObjectType):
    """Represents an error in wishlist operations."""

    field = graphene.String(description="Name of the field that caused the error.")
    message = graphene.String(description="The error message.")
    code = graphene.String(description="The error code.")


class WishlistAddProduct(BaseMutation):
    """Add a product to the user's wishlist."""

    wishlist = graphene.Field(Wishlist, description="The updated wishlist.")
    wishlist_item = graphene.Field(
        WishlistItem, description="The newly created wishlist item."
    )

    class Arguments:
        product_id = graphene.ID(
            required=True,
            description="ID of the product to add to wishlist.",
        )
        variant_id = graphene.ID(
            description="ID of the specific variant to add (optional).",
        )

    class Meta:
        description = "Add a product to the current user's wishlist."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = WishlistError
        error_type_field = "wishlist_errors"

    @classmethod
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to add items to wishlist.")

        product_id = data.get("product_id")
        variant_id = data.get("variant_id")

        # Get or create wishlist for user
        wishlist, _ = models.Wishlist.objects.get_or_create(user=user)

        # Resolve product ID
        _, product_pk = from_global_id_or_error(product_id, "Product")

        # Resolve variant ID if provided
        variant_pk = None
        if variant_id:
            _, variant_pk = from_global_id_or_error(variant_id, "ProductVariant")

        # Check if item already exists
        existing_item = models.WishlistItem.objects.filter(
            wishlist=wishlist,
            product_id=product_pk,
            variant_id=variant_pk,
        ).first()

        if existing_item:
            return cls(wishlist=wishlist, wishlist_item=existing_item)

        # Create new wishlist item
        wishlist_item = models.WishlistItem.objects.create(
            wishlist=wishlist,
            product_id=product_pk,
            variant_id=variant_pk,
        )

        return cls(wishlist=wishlist, wishlist_item=wishlist_item)


class WishlistRemoveProduct(BaseMutation):
    """Remove a product from the user's wishlist."""

    wishlist = graphene.Field(Wishlist, description="The updated wishlist.")

    class Arguments:
        product_id = graphene.ID(
            required=True,
            description="ID of the product to remove from wishlist.",
        )
        variant_id = graphene.ID(
            description="ID of the specific variant to remove (optional).",
        )

    class Meta:
        description = "Remove a product from the current user's wishlist."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = WishlistError
        error_type_field = "wishlist_errors"

    @classmethod
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to modify wishlist.")

        product_id = data.get("product_id")
        variant_id = data.get("variant_id")

        # Get wishlist
        try:
            wishlist = models.Wishlist.objects.get(user=user)
        except models.Wishlist.DoesNotExist:
            raise ValidationError("Wishlist not found.")

        # Resolve IDs
        _, product_pk = from_global_id_or_error(product_id, "Product")

        variant_pk = None
        if variant_id:
            _, variant_pk = from_global_id_or_error(variant_id, "ProductVariant")

        # Remove item
        models.WishlistItem.objects.filter(
            wishlist=wishlist,
            product_id=product_pk,
            variant_id=variant_pk,
        ).delete()

        return cls(wishlist=wishlist)


class WishlistClear(BaseMutation):
    """Clear all items from the user's wishlist."""

    wishlist = graphene.Field(Wishlist, description="The emptied wishlist.")

    class Meta:
        description = "Remove all items from the current user's wishlist."
        doc_category = DOC_CATEGORY_PRODUCTS
        error_type_class = WishlistError
        error_type_field = "wishlist_errors"

    @classmethod
    def perform_mutation(cls, root, info: ResolveInfo, /, **data):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise ValidationError("You must be logged in to modify wishlist.")

        try:
            wishlist = models.Wishlist.objects.get(user=user)
            wishlist.items.all().delete()
        except models.Wishlist.DoesNotExist:
            wishlist = models.Wishlist.objects.create(user=user)

        return cls(wishlist=wishlist)
