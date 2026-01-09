import random

from django.conf import settings


class PrimaryReplicaRouter:
    """
    Database router that directs:
    - All writes to the primary database
    - Reads to replica databases (if available) for better load distribution
    - Falls back to primary if replica is unavailable
    """

    def db_for_read(self, model, **hints):
        """
        Route read queries to replica database when available.
        Falls back to primary if replica is not configured.
        """
        # Check if replica database is configured and different from primary
        replica_config = settings.DATABASES.get(settings.DATABASE_CONNECTION_REPLICA_NAME)
        primary_config = settings.DATABASES.get(
            settings.DATABASE_CONNECTION_DEFAULT_NAME
        )

        if not replica_config:
            return settings.DATABASE_CONNECTION_DEFAULT_NAME

        # If replica points to same database as primary, use primary
        # (happens when DATABASE_URL_REPLICA is not set)
        if (
            replica_config.get("NAME") == primary_config.get("NAME")
            and replica_config.get("HOST") == primary_config.get("HOST")
            and replica_config.get("PORT") == primary_config.get("PORT")
        ):
            return settings.DATABASE_CONNECTION_DEFAULT_NAME

        # Use replica for read operations
        return settings.DATABASE_CONNECTION_REPLICA_NAME

    def db_for_write(self, model, **hints):
        """Write only to primary."""
        return settings.DATABASE_CONNECTION_DEFAULT_NAME

    def allow_relation(self, obj1, obj2, **hints):
        """All relations are allowed as we don't have pool separation."""
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure migrations only run on primary database."""
        return db == settings.DATABASE_CONNECTION_DEFAULT_NAME
