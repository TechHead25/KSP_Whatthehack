#!/bin/sh
echo "="
echo "      NETRA AI — ZOHO CATALYST APPSAIL BACKEND"
echo "="
echo "[DIAGNOSTICS] Current Working Directory:"
pwd
echo "[DIAGNOSTICS] Directory Listing:"
ls -la
echo "[DIAGNOSTICS] Recursive file tree:"
find . -type f
echo "[DIAGNOSTICS] Python executable:"
which python || which python3
echo "[DIAGNOSTICS] Python version:"
python --version || python3 --version
echo "[DIAGNOSTICS] Environment variables:"
env
echo "[DIAGNOSTICS] sys.path:"
python -c "import sys; print(sys.path)" || python3 -c "import sys; print(sys.path)"
echo "[DIAGNOSTICS] Location of start.py:"
find $(pwd) -name start.py
echo "[DIAGNOSTICS] Location of main.py:"
find $(pwd) -name main.py
echo "[DIAGNOSTICS] Current command:"
cat app-config.json

echo "Starting application..."
python start.py || python3 start.py
