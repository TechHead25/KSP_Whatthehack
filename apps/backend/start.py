# ============================================================
# NETRA AI — Production AppSail Startup Entrypoint
# ============================================================
import os
import sys
import site
import glob

print(f"[NETRA API] Python process started. PID={os.getpid()}", flush=True)
print(f"[NETRA API] X_ZOHO_CATALYST_LISTEN_PORT={os.getenv('X_ZOHO_CATALYST_LISTEN_PORT')}", flush=True)
print(f"[NETRA API] PORT={os.getenv('PORT')}", flush=True)

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

    port_str = os.getenv("X_ZOHO_CATALYST_LISTEN_PORT") or os.getenv("PORT") or "8000"
    port = int(port_str)

    print("=" * 60, flush=True)
    print("      NETRA AI — ZOHO CATALYST APPSAIL BACKEND", flush=True)
    print("=" * 60, flush=True)
    print(f"Python Version    : {sys.version.split()[0]} ({sys.executable})", flush=True)
    print(f"Working Directory : {os.getcwd()}", flush=True)
    print(f"Target Port       : {port}", flush=True)
    print(f"Environment       : {settings.environment}", flush=True)
    print("=" * 60, flush=True)
    print(f"[NETRA API] Starting uvicorn server on 0.0.0.0:{port}...", flush=True)

    uvicorn.run("main:app", host="0.0.0.0", port=port)
