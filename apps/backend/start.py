import os
import sys
import site
import glob

# Ensure current directory is at top of sys.path
cwd = os.path.dirname(os.path.abspath(__file__))
if cwd not in sys.path:
    sys.path.insert(0, cwd)

# Auto-discover site-packages
user_site = site.getusersitepackages()
if user_site and user_site not in sys.path and os.path.exists(user_site):
    sys.path.insert(0, user_site)

for sp in glob.glob("/catalyst/**/site-packages", recursive=True) + glob.glob("/root/**/site-packages", recursive=True):
    if sp not in sys.path:
        sys.path.insert(0, sp)

import uvicorn
import main

if __name__ == "__main__":
    port_str = os.environ.get("X_ZOHO_CATALYST_LISTEN_PORT") or os.environ.get("PORT") or "8000"
    port = int(port_str)
    print(f"[NETRA API] Starting uvicorn server on 0.0.0.0:{port}...")
    uvicorn.run(main.app, host="0.0.0.0", port=port)
