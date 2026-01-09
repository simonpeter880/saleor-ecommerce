import graphene

from ...permission.auth_filters import AuthorizationFilters
from ...wishlist import models
from ..core import ResolveInfo
from ..core.doc_category import DOC_CATEGORY_PRODUCTS
from ..core.fields import PermissionsField
from .mutations import WishlistAddProduct, WishlistClear, WishlistRemoveProduct
from .types import Wishlist


class WishlistQueries(graphene.ObjectType):
    """Queries for wishlist operations."""

    wishlist = PermissionsField(
        Wishlist,
        description="Get the current user's wishlist.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
        doc_category=DOC_CATEGORY_PRODUCTS,
    )

    @staticmethod
    def resolve_wishlist(root, info: ResolveInfo, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            return None

        wishlist, _ = models.Wishlist.objects.get_or_create(user=user)
        return wishlist


class WishlistMutations(graphene.ObjectType):
    """Mutations for wishlist operations."""

    wishlist_add_product = WishlistAddProduct.Field()
    wishlist_remove_product = WishlistRemoveProduct.Field()
    wishlist_clear = WishlistClear.Field()
