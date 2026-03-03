#!/bin/bash
# Daily API Cost Monitor Cron Script

# Change to the skill directory
cd /home/node/.openclaw/workspace/skills/cost-monitor

# Run the cost monitor and send report to Slack
python3 cost-monitor.py > daily_report.txt 2>&1

# Check if the report was generated successfully
if [ $? -eq 0 ]; then
    echo "✅ API Cost Monitor ran successfully"
    # Send the report to Slack via webchat integration
    python3 -c "
import os
import sys
sys.path.append('/home/node/.openclaw/workspace')
from skills.cost-monitor.cost-monitor import CostMonitor
monitor = CostMonitor()
report = monitor.generate_daily_report()

try:
    # Send to Slack via message tool
    import os
    os.system('openclaw tool message send --channel slack --message \"$(python3 /home/node/.openclaw/workspace/skills/cost-monitor/cost-monitor.py)\" --target \"#edna-ops-agents\"')
except Exception as e:
    print(f'Error sending to Slack: {e}')
"
else
    echo "❌ API Cost Monitor failed"
    # Send error notification
    error_msg="🚨 API Cost Monitor failed to run - check logs"
    python3 -c "
import os
os.system('openclaw tool message send --channel slack --message \"$error_msg\" --target \"#edna-ops-agents\"')
"
fi