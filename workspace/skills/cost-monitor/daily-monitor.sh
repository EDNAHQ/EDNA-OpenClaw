#!/bin/bash
# Cost Monitor Daily Cron
# This script should be added to crontab to run daily at 20:00 UTC (8 PM)

# Add this line to crontab:
# 0 20 * * * /usr/bin/env bash /home/node/.openclaw/workspace/skills/cost-monitor/daily-monitor.sh

# Change to correct directory
SCRIPT_DIR="/home/node/.openclaw/workspace/skills/cost-monitor"
cd "$SCRIPT_DIR"

# Set environment variables
export PATH="/usr/local/bin:$PATH"
export PYTHONUNBUFFERED=1
export OPENROUTER_API_KEY="${OPENROUTER_API_KEY}"
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY}"

# Create log directory
mkdir -p logs
LOG_FILE="logs/cost-monitor-$(date '+%Y-%m-%d').log"

# Run the monitor and log output
echo "$(date): Starting API cost monitor" >> "$LOG_FILE"

# Run the cost monitor
python3 /home/node/.openclaw/workspace/skills/cost-monitor/cost-monitor.py >> "$LOG_FILE" 2>&1

# Check exit code
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ]; then
    echo "$(date): Cost monitor completed successfully" >> "$LOG_FILE"
else
    echo "$(date): Cost monitor failed with exit code $EXIT_CODE" >> "$LOG_FILE"
    # Send error to Slack
    openclaw tool message send --channel slack --target "#edna-ops-agents" --message "🚨 API cost monitor failed - check logs at $LOG_FILE"
fi