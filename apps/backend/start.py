# ============================================================
# NETRA AI — Production AppSail Startup Entrypoint
# ============================================================
import os
import sys
import site
import glob

# 1. Ensure root directory is top of sys.path for absolute imports
cwd = os.path.dirname(os.path.abspath(__file__))
if cwd not in sys.path:
    sys.path.insert(0, cwd)

# 2. Discover container site-packages (Zoho Catalyst AppSail runtime)
user_site = site.getusersitepackages()
if user_site and user_site not in sys.path and os.path.exists(user_site):
    sys.path.insert(0, user_site)

for sp in glob.glob("/catalyst/**/site-packages", recursive=True) + glob.glob("/root/**/site-packages", recursive=True):
    if os.path.exists(sp) and sp not in sys.path:
        sys.path.insert(0, sp)

# 3. Import FastAPI main application
import uvicorn
import main
from core.config import get_settings

if __name__ == "__main__":
    settings = get_settings()

    # Port resolution per specification:
    # 1. X_ZOHO_CATALYST_LISTEN_PORT (Catalyst AppSail)
    # 2. PORT (Standard PaaS fallback)
    # 3. 8000 (Default)
    port_str = os.getenv("X_ZOHO_CATALYST_LISTEN_PORT") or os.getenv("PORT") or "8080"
    port = int(port_str)

    # Verbose startup logging
    print("=" * 60)
    print("      NETRA AI — ZOHO CATALYST APPSAIL BACKEND")
    print("=" * 60)
    print(f"Python Version    : {sys.version.split()[0]} ({sys.executable})")
    print(f"Working Directory : {os.getcwd()}")
    print(f"Startup Command   : python3 start.py")
    print(f"Target Port       : {port}")
    print(f"Environment       : {settings.environment}")
    print(f"App Version       : {settings.app_version}")
    print(f"Database URL      : {settings.database_url.split('://')[0]}://***")
    print(f"CORS Origins      : {settings.cors_origins}")
    print("=" * 60)
    print(f"[NETRA API] Starting uvicorn server on 0.0.0.0:{port}...")

    uvicorn.run("main:app", host="0.0.0.0", port=port)
