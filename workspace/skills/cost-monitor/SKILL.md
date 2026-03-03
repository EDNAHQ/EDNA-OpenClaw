# Cost Monitor Skill

API cost monitoring and optimization recommendations for Enterprise DNA.

## Overview
This skill tracks API usage costs across our major providers (Anthropic, OpenRouter, and extensible for others) and provides daily reports with optimization recommendations.

## Configuration Required
- OPENROUTER_API_KEY (already configured via env)
- ANTHROPIC_API_KEY (needs to be stored securely)
- Webhook URLs for notifications (optional)

## Daily Reports Include
- Total costs per provider
- Usage patterns and trends
- High-cost operations identification
- Optimization suggestions
- Threshold alerts

## Extensibility
The design allows adding new providers modularly.

## Files
- cost-monitor.py - Main monitoring script
- providers/ - Individual provider integrations
- reports/ - Generated report templates
- config.py - Configuration and thresholds