"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Hash, ArrowRight, Code2, Terminal } from "lucide-react";
import { ModeToggle } from "@/components/theme-switcher";

export default function Home() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    if (!room || room.trim().length < 2)
      return "Room name must be at least 2 characters";
    if (!username || username.trim().length < 2)
      return "Username must be at least 2 characters";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) return setErr(v);

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push(
      `/room/${encodeURIComponent(room.trim())}?username=${encodeURIComponent(
        username.trim()
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground flex flex-col items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="absolute top-6 right-6 z-10">
        <ModeToggle /> 
      </div>

      <section className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  Code
                  <br />
                  <span className="text-gray-500">Together</span>
                </h1>
              </div>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-light">
              Real-time collaborative coding environment. Join a room and start
              coding together.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <div className="border-1 p-1 rounded-lg">Infinite Rooms</div>
            </div>
            <div>
              <div className="border-1 p-1 rounded-lg">Lightening Fast</div>
            </div>
            <div>
              <div className="border-1 p-1 rounded-lg">AI Powered</div>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">
                Join Room
              </CardTitle>
              <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                Enter room details to start collaborating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label
                    htmlFor="room"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Hash className="w-4 h-4" />
                    Room Name
                  </Label>
                  <Input
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="frontend-interview"
                    className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="username"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="john_doe"
                    className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors"
                  />
                </div>

                {err && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {err}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin"></div>
                      Joining...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Join Room
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <div className="relative bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  {room || "room"}.js
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="p-6 font-mono text-sm space-y-3">
              <div className="text-gray-500 dark:text-gray-500">
                {" "}
                Room: {room || "waiting..."}
              </div>
              <div className="text-gray-500 dark:text-gray-500">
                {" "}
                User: {username || "anonymous"}
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-800 dark:text-gray-200">
                    const
                  </span>{" "}
                  <span className="text-black dark:text-white font-semibold">
                    room
                  </span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    &quot;{room || "my-room"}&quot;
                  </span>
                </div>
                <div>
                  <span className="text-gray-800 dark:text-gray-200">
                    const
                  </span>{" "}
                  <span className="text-black dark:text-white font-semibold">
                    user
                  </span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    &quot;{username || "developer"}&quot;
                  </span>
                </div>

                <div className="pt-4">
                  <div className="text-gray-800 dark:text-gray-200">
                    <span className="text-gray-800 dark:text-gray-200">
                      function
                    </span>{" "}
                    <span className="text-black dark:text-white font-semibold">
                      startSession
                    </span>
                    <span className="text-gray-500">() {"{"}</span>
                  </div>
                  <div className="ml-4 text-gray-600 dark:text-gray-400">
                    console.log(`Connected to ${"{room}"}`)
                  </div>
                  <div className="ml-4 text-gray-600 dark:text-gray-400">
                    Ready to code...
                  </div>
                  <div className="text-gray-500">{"}"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {room && username ? "Ready to join" : "Enter details above"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
