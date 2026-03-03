# Cost Monitor Setup Instructions

## Quick Setup

1. **Test the script locally:**
   ```bash
   cd /home/node/.openclaw/workspace/skills/cost-monitor
   python3 cost-monitor.py
   ```

2. **Add the cron job:**
   ```bash
   # Add to crontab:
   crontab -e
   
   # Add this line (runs daily at 8 PM UTC):
   0 20 * * * /home/node/.openclaw/workspace/skills/cost-monitor/daily-monitor.sh
   ```

3. **Test the cron job manually:**
   ```bash
   /home/node/.openclaw/workspace/skills/cost-monitor/daily-monitor.sh
   ```

## Configuration

### Environment Variables Required:
- `OPENROUTER_API_KEY` - Already configured in your OpenClaw instance
- `ANTHROPIC_API_KEY` - Add to your environment if you want Anthropic cost tracking

### Threshold Customization:
Edit `config.json` to adjust warning thresholds:
- `daily_warning` - Alert if daily costs exceed this amount (default: $5)
- `daily_alert` - High priority alert threshold (default: $10)
- `weekly_warning` - Weekly budget warning (default: $35)

## Extending for New Providers

To add a new provider:
1. Add the provider to the `providers` section in config.json
2. Create a new method in cost-monitor.py: `get_{provider}_costs()`
3. Update the `generate_daily_report()` method to include the new provider

## Files Created:
- `cost-monitor.py` - Main monitoring script
- `config.json` - Configuration settings
- `costs.db` - SQLite database for storing historical data
- `logs/` - Directory for daily logs
- `daily-monitor.sh` - Cron execution script

## Troubleshooting

### Common Issues:
1. **Permission denied**: Ensure scripts are executable (`chmod +x`)
2. **Missing API key**: Set environment variables before running
3. **Slack not receiving messages**: Check channel permissions

### Manual Testing:
```bash
# Run once to verify
./daily-monitor.sh

# Check logs
cat logs/cost-monitor-$(date '+%Y-%m-%d').log
```