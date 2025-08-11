"use client";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { use, useEffect, useRef, useState } from "react";
import {
  Users,
  Play,
  RotateCcw,
  Settings,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/theme-switcher";

export default function RoomIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  const [code, setCode] = useState("// Start coding...");
  const isUpdatingFromServer = useRef(false);
  // const [question, setQuestion] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      switch (data.type) {
        case "USER_LIST":
          setUsers(data.users);
          break;
        case "CODE_UPDATE":
          if (data.code !== code) {
            isUpdatingFromServer.current = true;
            setCode(data.code);
          }
          break;
        case "USER_JOINED":
          console.log(users);
          setUsers((prevUsers) => [...prevUsers, data.userName]);
          console.log(users);
          break;
        // case "QUESTION_UPDATE":
        //   setQuestion(data.question);
        //   break;
        default:
          break;
      }
    };
    ws.onclose = () => {
      console.log(" WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);
  const handleJoin = () => {
    if (socket && userName.trim()) {
      socket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          roomId: id,
          userName,
        })
      );
      setJoined(true);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return;

    setCode(value);

    if (isUpdatingFromServer.current) {
      isUpdatingFromServer.current = false;
      return;
    }

    socket?.send(
      JSON.stringify({
        type: "CODE_CHANGE",
        roomId: id,
        codeChange: value,
      })
    );
  };
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  function clearCode() {
    setCode("");
    if (isUpdatingFromServer.current) {
      isUpdatingFromServer.current = false;
      return;
    }

    socket?.send(
      JSON.stringify({
        type: "CODE_CHANGE",
        roomId: id,
        codeChange: "",
      })
    );
  }
  function setNewQuestion() {
    //to be implemented
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Join Room</CardTitle>
            <p className="text-sm text-muted-foreground">Room: {id}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>
            <Button
              onClick={handleJoin}
              className="w-full"
              disabled={!userName.trim()}
            >
              <User className="w-4 h-4 mr-2" />
              Join Room
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Room: {id}</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {users.length} online
            </Badge>
            <ModeToggle />
          </div>

          <div className="flex items-center gap-2">
            {users.slice(0, 6).map((user, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                {i < 3 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    {user}
                  </span>
                )}
              </div>
            ))}
            {users.length > 6 && (
              <Badge variant="outline" className="ml-2">
                +{users.length - 6}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">1. Two Sum</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Easy
                  </Badge>
                  <Button size={"sm"} onClick={setNewQuestion}>
                    Set New Question
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Accepted: 4.2M
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Submissions: 8.1M
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Given an array of integers{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                      nums
                    </code>{" "}
                    and an integer{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                      target
                    </code>
                    , return{" "}
                    <em>
                      indices of the two numbers such that they add up to target
                    </em>
                    .
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    You may assume that each input would have{" "}
                    <strong>exactly one solution</strong>, and you may not use
                    the same element twice.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                    You can return the answer in any order.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example 1:</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                    <div>
                      <strong>Input:</strong> nums = [2,7,11,15], target = 9
                    </div>
                    <div>
                      <strong>Output:</strong> [0,1]
                    </div>
                    <div>
                      <strong>Explanation:</strong> Because nums[0] + nums[1] ==
                      9, we return [0, 1].
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Example 2:</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                    <div>
                      <strong>Input:</strong> nums = [3,2,4], target = 6
                    </div>
                    <div>
                      <strong>Output:</strong> [1,2]
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                        2 ≤ nums.length ≤ 10⁴
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                        -10⁹ ≤ nums[i] ≤ 10⁹
                      </code>
                    </li>
                    <li>
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                        -10⁹ ≤ target ≤ 10⁹
                      </code>
                    </li>
                    <li>
                      <strong>Only one valid answer exists.</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C++</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearCode}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                Last saved: just now
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-1" />
                  Run Code
                </Button>
                <Button size="sm">Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
