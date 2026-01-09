from django.db.models.signals import m2m_changed, post_delete, post_save
from django.dispatch import receiver

from ..core.cache_utils import invalidate_user_cache
from ..core.tasks import delete_from_storage_task


def delete_avatar(sender, instance, **kwargs):
    if avatar := instance.avatar:
        delete_from_storage_task.delay(avatar.name)


# Cache invalidation signal handlers


@receiver([post_save, post_delete], sender="account.User")
def invalidate_user_permissions_cache(sender, instance, **kwargs):
    """
    Invalidate user permissions cache when user is updated or deleted.
    """
    invalidate_user_cache(instance.id)


@receiver(m2m_changed, sender="account.User_groups")
def invalidate_user_cache_on_group_change(sender, instance, **kwargs):
    """
    Invalidate user permissions cache when user groups change.
    """
    from .models import User

    if isinstance(instance, User):
        invalidate_user_cache(instance.id)


@receiver([post_save, post_delete], sender="account.Group")
def invalidate_group_users_cache(sender, instance, **kwargs):
    """
    Invalidate cache for all users in a group when group permissions change.
    """
    # Invalidate cache for all users in this group
    for user in instance.user_set.all():
        invalidate_user_cache(user.id)


@receiver(m2m_changed, sender="account.Group_permissions")
def invalidate_group_cache_on_permission_change(sender, instance, **kwargs):
    """
    Invalidate cache for all users in group when group permissions change.
    """
    from .models import Group

    if isinstance(instance, Group):
        # Invalidate cache for all users in this group
        for user in instance.user_set.all():
            invalidate_user_cache(user.id)
