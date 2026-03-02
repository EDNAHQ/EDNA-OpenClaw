---
name: youtube-transcript
description: "Fetch YouTube video transcripts via RapidAPI (youtube-transcript3). Use when asked to transcribe, summarize, or extract text from YouTube videos."
---

# YouTube Transcript Skill

## Overview
Fetch transcripts/subtitles from any YouTube video using the youtube-transcript3 API on RapidAPI.

## Account Details
- **API:** youtube-transcript3 by solid-api
- **Plan:** 100,000 requests/month
- **RapidAPI page:** https://rapidapi.com/solid-api-solid-api-default/api/youtube-transcript3

## Auth
- **Key env var:** `RAPIDAPI_KEY`
- **Host:** `youtube-transcript3.p.rapidapi.com`

## Endpoints

### Get transcript by video ID
```bash
curl -s -X GET "https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=VIDEO_ID" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: youtube-transcript3.p.rapidapi.com"
```

### Get transcript by URL
```bash
curl -s -X GET "https://youtube-transcript3.p.rapidapi.com/api/transcript?url=https://www.youtube.com/watch?v=VIDEO_ID" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: youtube-transcript3.p.rapidapi.com"
```

### Get transcript in specific language
```bash
curl -s -X GET "https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=VIDEO_ID&lang=en" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: youtube-transcript3.p.rapidapi.com"
```

## Response Format
```json
{
  "success": true,
  "transcript": [
    {
      "text": "Hello world",
      "duration": "5.24",
      "offset": "0.00",
      "lang": "en"
    }
  ]
}
```

## Extracting Full Text
To get a clean readable transcript from the response:
```bash
curl -s ... | python3 -c "
import json,sys,html
d=json.load(sys.stdin)
if d.get('success'):
    text = ' '.join(html.unescape(seg['text']) for seg in d['transcript'])
    print(text)
else:
    print('Error:', d)
"
```

## Common Use Cases
- Transcribe a YouTube video for summarization
- Extract quotes or key points from a video
- Get subtitles for content repurposing
- Research/analyze video content at scale

## Notes
- Videos without captions/subtitles will return an error
- Auto-generated captions are available for most videos
- HTML entities in text (e.g. `&#39;`) need unescaping — use `html.unescape()`
- Rate limit: 100,000 requests/month on current plan
