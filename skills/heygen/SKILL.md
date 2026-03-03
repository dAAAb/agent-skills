# HeyGen Skill

Generate AI avatar videos using HeyGen API.

## Prerequisites

- HeyGen API key (set as `HEYGEN_API_KEY` env var or pass directly)
- Existing avatars and voices in your HeyGen account

## Available Commands

### List Avatars
```bash
curl -s "https://api.heygen.com/v2/avatars" \
  -H "X-Api-Key: $HEYGEN_API_KEY" | jq '.data.avatars[] | {avatar_id, avatar_name}'
```

### List Voices
```bash
curl -s "https://api.heygen.com/v2/voices" \
  -H "X-Api-Key: $HEYGEN_API_KEY" | jq '.data.voices[] | {voice_id, name, language}'
```

### Generate Video

Use the Python script for easy video generation:

```bash
python3 /Users/vitalik/clawd/skills/heygen/scripts/generate_video.py \
  --text "你好，我是葛如鈞" \
  --avatar-id "838320ce7ca646d3a6306c098c7ee89b" \
  --voice-id "102b19ecd46b444c8098a33c8d8eb37f" \
  --output /tmp/heygen-video.mp4
```

#### Options
- `--text`: Script for the avatar to speak (required)
- `--avatar-id`: Avatar ID (default: JCKOV1)
- `--voice-id`: Voice ID (default: JCKOV1 voice)
- `--output`: Output file path (default: /tmp/heygen-output.mp4)
- `--dimension`: Video dimensions WxH (default: 1280x720)
- `--aspect-ratio`: Aspect ratio (default: 16:9)
- `--wait`: Wait for video completion (default: true)
- `--timeout`: Max wait time in seconds (default: 300)

### Check Video Status

```bash
curl -s "https://api.heygen.com/v1/video_status.get?video_id=VIDEO_ID" \
  -H "X-Api-Key: $HEYGEN_API_KEY"
```

## 寶博專用設定

### Avatars (已建立)
| Name | Avatar ID |
|------|-----------|
| JCKOV1 | `838320ce7ca646d3a6306c098c7ee89b` |
| JC Ko (v2.1) | `c121c484bf074033aab06a8455b94885` |
| JC Ko (v2.2) | `91e70516d79043658917bc043390465f` |

### Voices (已建立)
| Name | Voice ID |
|------|----------|
| JCKOV1 | `102b19ecd46b444c8098a33c8d8eb37f` |
| JC Ko LYV | `7c8303cabd2a4882a63eb8be6cc9abef` |
| JC Ko | `84e4663b7e18494e9159e7db2cd0b4f0` |

### 快速生成範例

```bash
# 用寶博的 avatar + voice 生成影片
HEYGEN_API_KEY="$HEYGEN_API_KEY" \
python3 /Users/vitalik/clawd/skills/heygen/scripts/generate_video.py \
  --text "大家好，我是立法委員葛如鈞，今天要跟大家分享..." \
  --output /tmp/baobao-video.mp4
```

## API Reference

- [HeyGen API Docs](https://docs.heygen.com/)
- [Create Video (V2)](https://docs.heygen.com/reference/create-an-avatar-video-v2)
- [Video Status](https://docs.heygen.com/reference/video-status)
