"use client";
import {
  ControlBar,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useParticipants,
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
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const quotes = [
    "First, solve the problem. Then, write the code.  John Johnson",
    "Programs must be written for people to read, and only incidentally for machines to execute.  Harold Abelson",
    "Code is like humor. When you have to explain it, its bad.  Cory House",
    "Simplicity is the soul of efficiency.  Austin Freeman",
    "Talk is cheap. Show me the code. Linus Torvalds",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="flex h-full gap-4">
      <div className="flex flex-wrap gap-2">
        {tracks.map((track) => (
          <ParticipantTile
            key={track.publication?.trackSid || Math.random()}
            trackRef={track}
            className="rounded-lg overflow-hidden shadow-md border border-slate-200 dark:border-slate-600 w-[200px] h-[150px]"
          />
        ))}
      </div>

      {participants.length < 6 && (
        <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center text-slate-700 dark:text-slate-200 italic shadow-md">
          {randomQuote}
        </div>
      )}
    </div>

  );
}
