# EDNA Platform Content Crawl Instructions

## BrowserBase Context ID
47ed03c6-ac00-41e5-8264-eeecb396f023

## Authenticated URLs to crawl
- https://app.enterprisedna.co/app/learning-courses (Courses - paginated, scroll to load more)
- https://app.enterprisedna.co/app/learning-paths (Learning Paths)
- https://app.enterprisedna.co/app/events (Events/Webinars)
- https://app.enterprisedna.co/app/learning-assessments (Assessments)
- https://app.enterprisedna.co/app/podcasts (Podcasts)

## Skill location
~/.openclaw/workspace/skills/browserbase/

## What to extract per item
- Title
- Level (Beginner/Intermediate/Advanced)
- Duration (hours)
- XP points
- Author/Instructor
- Last updated date
- Description
- Type (Course/Event/Assessment/Podcast/Path)
- Tools mentioned
- Skills mentioned
- Status tags (free, native, teamable, demo, etc.)

## Scrolling/Pagination
The courses page may need scrolling to load all items. Use evaluate to scroll and wait for new content.

## Output
Save all extracted data to /home/node/.openclaw/workspace/edna-audit/content-catalogue.json
