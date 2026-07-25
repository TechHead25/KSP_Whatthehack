#!/bin/sh
echo "NETRA AI - Starting backend..."
echo "Setting up Python dependencies in /tmp/deps..."
export PYTHONPATH=/tmp/deps:$PYTHONPATH
python3 -m pip install -r requirements.txt -t /tmp/deps --disable-pip-version-check --no-cache-dir

echo "Dependencies installed. Starting Uvicorn..."
python3 -m uvicorn main:app --host 0.0.0.0 --port $X_ZOHO_CATALYST_LISTEN_PORT
