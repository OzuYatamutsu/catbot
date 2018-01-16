#!/bin/bash
RESTART_TIMEOUT=5
START_CMD='python3 run.py'

until $START_CMD; do
    echo "Catbot died unexpectedly. Respawning in $RESTART_TIMEOUT seconds..."
    sleep $RESTART_TIMEOUT
done
