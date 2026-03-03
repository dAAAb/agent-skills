#!/usr/bin/env python3
"""
HeyGen Video Generation Script
Generate AI avatar videos using HeyGen API.
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_BASE = "https://api.heygen.com"

# Default settings (override with --avatar-id and --voice-id)
DEFAULT_AVATAR_ID = ""  # Set via --avatar-id or HEYGEN_AVATAR_ID env
DEFAULT_VOICE_ID = ""   # Set via --voice-id or HEYGEN_VOICE_ID env


def get_api_key():
    key = os.environ.get("HEYGEN_API_KEY")
    if not key:
        print("Error: HEYGEN_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)
    return key


def api_request(method, endpoint, data=None, api_key=None):
    """Make API request to HeyGen."""
    url = f"{API_BASE}{endpoint}"
    headers = {
        "X-Api-Key": api_key or get_api_key(),
        "Content-Type": "application/json",
    }
    
    if data:
        data = json.dumps(data).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else ""
        print(f"API Error {e.code}: {error_body}", file=sys.stderr)
        sys.exit(1)


def create_video(text, avatar_id, voice_id, dimension, aspect_ratio, audio_url=None, speed=None, emotion=None, language=None):
    """Create a new video generation request."""
    width, height = map(int, dimension.split("x"))
    
    # 如果提供了 audio_url，使用外部音訊（如 ElevenLabs）驅動嘴型同步
    if audio_url:
        voice_config = {
            "type": "audio",
            "audio_url": audio_url
        }
    else:
        voice_config = {
            "type": "text",
            "input_text": text,
            "voice_id": voice_id
        }
        # 加入進階語音參數（2026-02-28 A/B 測試最佳設定）
        if speed:
            voice_config["speed"] = speed
        if emotion:
            voice_config["emotion"] = emotion
        if language:
            voice_config["language"] = language
    
    payload = {
        "video_inputs": [
            {
                "character": {
                    "type": "avatar",
                    "avatar_id": avatar_id,
                    "avatar_style": "normal"
                },
                "voice": voice_config
            }
        ],
        "dimension": {
            "width": width,
            "height": height
        },
        "aspect_ratio": aspect_ratio
    }
    
    result = api_request("POST", "/v2/video/generate", payload)
    
    if result.get("error"):
        print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(1)
    
    video_id = result.get("data", {}).get("video_id")
    if not video_id:
        print(f"Error: No video_id in response: {result}", file=sys.stderr)
        sys.exit(1)
    
    return video_id


def get_video_status(video_id):
    """Check video generation status."""
    result = api_request("GET", f"/v1/video_status.get?video_id={video_id}")
    return result.get("data", {})


def download_video(url, output_path):
    """Download the generated video."""
    print(f"Downloading video to {output_path}...")
    urllib.request.urlretrieve(url, output_path)
    print(f"✅ Video saved to {output_path}")


def wait_for_video(video_id, timeout=300, interval=10):
    """Wait for video to complete."""
    start = time.time()
    
    while time.time() - start < timeout:
        status = get_video_status(video_id)
        state = status.get("status", "unknown")
        
        print(f"Status: {state}")
        
        if state == "completed":
            return status.get("video_url")
        elif state == "failed":
            error = status.get("error", "Unknown error")
            print(f"❌ Video generation failed: {error}", file=sys.stderr)
            sys.exit(1)
        
        time.sleep(interval)
    
    print(f"❌ Timeout waiting for video (>{timeout}s)", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate HeyGen avatar video")
    parser.add_argument("--text", "-t", required=True, help="Script for avatar to speak")
    parser.add_argument("--avatar-id", "-a", default=DEFAULT_AVATAR_ID, help="Avatar ID")
    parser.add_argument("--voice-id", "-v", default=DEFAULT_VOICE_ID, help="Voice ID")
    parser.add_argument("--output", "-o", default="/tmp/heygen-output.mp4", help="Output file path")
    parser.add_argument("--dimension", "-d", default="1280x720", help="Video dimensions WxH")
    parser.add_argument("--aspect-ratio", default="16:9", help="Aspect ratio")
    parser.add_argument("--audio-url", help="Use external audio URL (e.g. ElevenLabs) instead of HeyGen TTS")
    parser.add_argument("--speed", type=float, default=0.98, help="Voice speed (default: 0.98)")
    parser.add_argument("--emotion", default="Friendly", help="Voice emotion: Excited/Friendly/Serious/Soothing/Broadcaster/Angry (default: Friendly)")
    parser.add_argument("--language", default="en", help="Voice language hint (default: en)")
    parser.add_argument("--no-wait", action="store_true", help="Don't wait for completion")
    parser.add_argument("--no-download", action="store_true", help="Don't download, just return HeyGen URL")
    parser.add_argument("--timeout", type=int, default=300, help="Max wait time in seconds")
    parser.add_argument("--api-key", help="HeyGen API key (or use HEYGEN_API_KEY env)")
    
    args = parser.parse_args()
    
    if args.api_key:
        os.environ["HEYGEN_API_KEY"] = args.api_key
    
    print(f"🎬 Creating video...")
    print(f"   Avatar: {args.avatar_id}")
    if args.audio_url:
        print(f"   Voice: EXTERNAL AUDIO (ElevenLabs etc.)")
        print(f"   Audio URL: {args.audio_url[:80]}...")
    else:
        print(f"   Voice: {args.voice_id} (HeyGen TTS)")
    print(f"   Text: {args.text[:50]}{'...' if len(args.text) > 50 else ''}")
    
    video_id = create_video(
        text=args.text,
        avatar_id=args.avatar_id,
        voice_id=args.voice_id,
        dimension=args.dimension,
        aspect_ratio=args.aspect_ratio,
        audio_url=args.audio_url,
        speed=args.speed,
        emotion=args.emotion,
        language=args.language
    )
    
    print(f"📹 Video ID: {video_id}")
    
    if args.no_wait:
        print("Use this command to check status:")
        print(f'  curl -s "https://api.heygen.com/v1/video_status.get?video_id={video_id}" -H "X-Api-Key: $HEYGEN_API_KEY"')
        return
    
    print(f"⏳ Waiting for video (timeout: {args.timeout}s)...")
    video_url = wait_for_video(video_id, timeout=args.timeout)
    
    if video_url:
        if args.no_download:
            print(f"\n✅ Done! Video URL: {video_url}")
            print(f"HEYGEN_URL={video_url}")
        else:
            download_video(video_url, args.output)
            print(f"\n✅ Done! Video: {args.output}")


if __name__ == "__main__":
    main()
