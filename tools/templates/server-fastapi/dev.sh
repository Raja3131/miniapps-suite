#!/usr/bin/env bash
set -e

# create venv if missing
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# activate
source .venv/bin/activate

# install deps
pip install --upgrade pip >/dev/null
pip install -r requirements.txt >/dev/null

# run
RELOAD="--reload"
if [ "$1" = "--no-reload" ]; then RELOAD=""; fi
export PYTHONPATH=.
exec uvicorn app.main:app --host 0.0.0.0 --port 3001 $RELOAD
