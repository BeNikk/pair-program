"use client";
import {
  ControlBar,
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
        adaptiveStream: true,
        dynacast: true,
      })
  );

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        if (mounted) {
          await room.connect(serverUrl, token);
        }
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
        className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col"
        style={{ height }}
      >
        {/* Video Grid */}
        <div className="flex-1 p-2 overflow-auto">
          <MyVideoConference />
        </div>

        {/* Audio Renderer */}
        <RoomAudioRenderer />

        {/* Control Bar Section */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 border-t border-slate-200 dark:border-slate-700">
          <ControlBar
            variation="minimal"
            controls={{
              camera: true,
              microphone: true,
              screenShare: false,
              chat: false,
              settings: false,
            }}
          />
        </div>
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {tracks.map((track) => (
        <ParticipantTile
          key={track.publication?.trackSid || Math.random()}
          trackRef={track}
          className="rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-600 w-[200px] h-[150px] flex-shrink-0"
        />
      ))}
    </div>
  );
}
