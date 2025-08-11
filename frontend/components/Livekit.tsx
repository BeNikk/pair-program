"use client";
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useState, useEffect } from "react";

const serverUrl = "wss://pair-programmer-h24bxg09.livekit.cloud";

export default function LiveKitComponent({
  token,
  height = "300px",
}: {
  token: string;
  height?: string;
}) {
  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  // Connect to room
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        if (mounted) {
          await room.connect(serverUrl, token);
        }
        // Enable camera and microphone after connecting
        await room.localParticipant.enableCameraAndMicrophone();
      } catch (error) {
        console.error("Failed to connect to room:", error);
      }
    };

    connect();

    return () => {
      mounted = false;
      room.disconnect();
    };
  }, [room, token]);

  return (
    <RoomContext.Provider value={room}>
      <div 
        data-lk-theme="default" 
        style={{ 
          height: height,
          width: "100%",
          position: "relative",
          backgroundColor: "#1f2937" // Dark background to match your theme
        }}
      >
        {/* Custom video conference component */}
        <MyVideoConference height={height} />
        {/* The RoomAudioRenderer takes care of room-wide audio */}
        <RoomAudioRenderer />
        {/* Controls positioned at the bottom */}
        <div style={{ 
          position: "absolute", 
          bottom: "8px", 
          left: "50%", 
          transform: "translateX(-50%)",
          zIndex: 10
        }}>
          <ControlBar 
            variation="minimal"
            controls={{
              camera: true,
              microphone: true,
              screenShare: false, // Disable screen share for cleaner UI
              chat: false,
              settings: false,
            }}
          />
        </div>
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference({ height }: { height: string }) {
  // Get all camera tracks from participants
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{
        height: "calc(100% - 48px)", // Leave space for control bar
        width: "100%",
        padding: "8px",
        gap: "8px",
      }}
    >
      {/* ParticipantTile will render each video as a small tile */}
      <ParticipantTile 
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </GridLayout>
  );
}