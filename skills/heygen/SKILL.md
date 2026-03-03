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
python3 scripts/generate_video.py \
  --text "Hello, this is a demo" \
  --avatar-id "YOUR_AVATAR_ID" \
  --voice-id "YOUR_VOICE_ID" \
  --output /tmp/heygen-video.mp4
```

#### Options
- `--text`: Script for the avatar to speak (required)
- `--avatar-id`: Avatar ID (default: MyAvatar)
- `--voice-id`: Voice ID (default: MyAvatar voice)
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

## your-avatar專用設定

### Avatars (已建立)
| Name | Avatar ID |
|------|-----------|
| MyAvatar | `YOUR_AVATAR_ID` |
| MyAvatar (v2.1) | `YOUR_AVATAR_ID_V2` |
| MyAvatar (v2.2) | `YOUR_AVATAR_ID_V3` |

### Voices (已建立)
| Name | Voice ID |
|------|----------|
| MyAvatar | `YOUR_VOICE_ID` |
| MyAvatar LYV | `7c8303cabd2a4882a63eb8be6cc9abef` |
| MyAvatar | `YOUR_VOICE_ID_V2` |

### 快速生成範例

```bash
# 用your-avatar的 avatar + voice 生成影片
HEYGEN_API_KEY="$HEYGEN_API_KEY" \
python3 scripts/generate_video.py \
  --text "Hello, this is a demo video..." \
  --output /tmp/baobao-video.mp4
```

## API Reference

- [HeyGen API Docs](https://docs.heygen.com/)
- [Create Video (V2)](https://docs.heygen.com/reference/create-an-avatar-video-v2)
- [Video Status](https://docs.heygen.com/reference/video-status)
