#!/bin/sh
echo "NETRA AI - Starting backend..."
export PYTHONPATH=./lib:$PYTHONPATH

echo "Starting Uvicorn..."
python3 -u -m uvicorn main:app --host 0.0.0.0 --port $X_ZOHO_CATALYST_LISTEN_PORT
