#!/usr/bin/env python
"""
Configure Google OAuth for Saleor OpenID Connect Plugin
Run this script after creating your Google OAuth credentials
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saleor.settings')
django.setup()

from saleor.plugins.models import PluginConfiguration

PLUGIN_ID = "mirumee.authentication.openidconnect"

def configure_google_oauth():
    """Configure Google OAuth in Saleor"""

    print("=" * 60)
    print("Google OAuth Configuration for Saleor")
    print("=" * 60)
    print()

    # Prompt for credentials
    print("Please enter your Google OAuth credentials:")
    print("(You can find these in Google Cloud Console > Credentials)")
    print()

    client_id = input("Google Client ID: ").strip()
    if not client_id:
        print("❌ Error: Client ID is required!")
        return

    client_secret = input("Google Client Secret: ").strip()
    if not client_secret:
        print("❌ Error: Client Secret is required!")
        return

    print()
    print("Configuring OpenID Connect plugin...")

    # Get or create plugin configuration
    config, created = PluginConfiguration.objects.get_or_create(
        identifier=PLUGIN_ID,
        defaults={"name": "OpenID Connect", "active": True}
    )

    # Update configuration
    config.active = True
    config.configuration = [
        {"name": "client_id", "value": client_id},
        {"name": "client_secret", "value": client_secret},
        {"name": "enable_refresh_token", "value": True},
        {"name": "oauth_authorization_url", "value": "https://accounts.google.com/o/oauth2/v2/auth"},
        {"name": "oauth_token_url", "value": "https://oauth2.googleapis.com/token"},
        {"name": "json_web_key_set_url", "value": "https://www.googleapis.com/oauth2/v3/certs"},
        {"name": "oauth_logout_url", "value": None},
        {"name": "user_info_url", "value": "https://openidconnect.googleapis.com/v1/userinfo"},
        {"name": "audience", "value": None},
        {"name": "use_oauth_scope_permissions", "value": False},
        {"name": "staff_user_domains", "value": None},
        {"name": "default_group_name_for_new_staff_users", "value": None},
    ]
    config.save()

    print()
    print("=" * 60)
    print("✅ Success! Google OAuth configured successfully!")
    print("=" * 60)
    print()
    print(f"Plugin ID: {PLUGIN_ID}")
    print(f"Status: {'Created' if created else 'Updated'}")
    print(f"Active: {config.active}")
    print()
    print("Configuration:")
    print(f"  • Client ID: {client_id[:20]}...")
    print(f"  • Authorization URL: https://accounts.google.com/o/oauth2/v2/auth")
    print(f"  • Token URL: https://oauth2.googleapis.com/token")
    print(f"  • Refresh Tokens: Enabled")
    print()
    print("Next Steps:")
    print("1. Make sure these redirect URIs are added in Google Cloud Console:")
    print("   • http://localhost:3000/channel-pln/auth/callback")
    print("   • http://localhost:8000/plugins/channel/mirumee.authentication.openidconnect/callback")
    print()
    print("2. Test Google Sign-In:")
    print("   Visit: http://localhost:3000/channel-pln/login")
    print("   Click 'Continue with Google'")
    print()
    print("3. For more details, see: GOOGLE_OAUTH_SETUP_GUIDE.md")
    print()

def check_configuration():
    """Check current OpenID Connect plugin configuration"""

    print("=" * 60)
    print("Checking OpenID Connect Plugin Configuration")
    print("=" * 60)
    print()

    try:
        config = PluginConfiguration.objects.get(identifier=PLUGIN_ID)

        print(f"✅ Plugin found!")
        print(f"Active: {config.active}")
        print()
        print("Configuration:")

        for item in config.configuration:
            name = item.get('name', 'unknown')
            value = item.get('value', None)

            # Mask sensitive values
            if name == 'client_secret' and value:
                value = value[:10] + "..." if len(value) > 10 else "***"
            elif name == 'client_id' and value:
                value = value[:20] + "..." if len(value) > 20 else value

            print(f"  • {name}: {value}")

        print()

        if not config.active:
            print("⚠️  Warning: Plugin is configured but not active!")
            activate = input("Would you like to activate it? (y/n): ").strip().lower()
            if activate == 'y':
                config.active = True
                config.save()
                print("✅ Plugin activated!")

    except PluginConfiguration.DoesNotExist:
        print("❌ OpenID Connect plugin is not configured yet!")
        print()
        setup = input("Would you like to configure it now? (y/n): ").strip().lower()
        if setup == 'y':
            configure_google_oauth()

    print()

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "check":
        check_configuration()
    else:
        print()
        print("This script will configure Google OAuth for your Saleor backend.")
        print()
        choice = input("Choose an option:\n  1. Configure Google OAuth\n  2. Check current configuration\n\nEnter 1 or 2: ").strip()

        if choice == "1":
            configure_google_oauth()
        elif choice == "2":
            check_configuration()
        else:
            print("Invalid choice!")
            sys.exit(1)
