"use client";
import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { use, useEffect, useState } from "react";
import {
  Users,
  Play,
  RotateCcw,
  Settings,
  Copy,
  CheckCircle,
  Clock,
  User,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/theme-switcher";
import { toast } from "sonner";
import LiveKitComponent from "@/components/Livekit";
import { getDifficultyColor } from "@/lib/utils";
import { Question } from "@/lib/type";

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
  const [token, setToken] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); //for local dev use- ws://localhost:8080   for prod use-wss://pair-program-1.onrender.com
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "USER_LIST":
          setUsers(data.users);
          break;
        case "CODE_UPDATE":
          if (data.code !== code) {
            setCode(data.code);
          }
          break;
        case "USER_JOINED":
          setUsers((prevUsers) => [...prevUsers, data.userName]);
          toast.success(`${data.userName} joined`);
          break;
        case "QUESTION_UPDATE":
          setQuestion(data.question);
          break;
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
  const handleJoin = async () => {
    if (socket && userName.trim()) {
      socket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          roomId: id,
          userName,
        })
      );
    }
    const res = await fetch(
      `https://pair-program-1.onrender.com/livekit/getToken?roomName=${id}&userName=${userName.trim()}`
    );
    const data = await res.json();
    setToken(data.token);
    setJoined(true);
  };

  const handleCodeChange = (value: string | undefined) => {
    if (!value) return;

    setCode(value);

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

    socket?.send(
      JSON.stringify({
        type: "CODE_CHANGE",
        roomId: id,
        codeChange: "",
      })
    );
  }
  async function setNewQuestion() {
    setLoadingQuestion(true);
    try {
      const res = await fetch("http://localhost:8080/api/chat/question");
      const response = await res.json();

      if (response.success) {
        const newQuestion = response.data;
        setQuestion(newQuestion);

        socket?.send(
          JSON.stringify({
            type: "QUESTION_CHANGE",
            roomId: id,
            question: newQuestion,
          })
        );

        toast.success("New question generated!");
      } else {
        toast.error("Failed to generate question");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Failed to fetch question");
    } finally {
      setLoadingQuestion(false);
    }
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

      {token && (
        <div className="h-[280px] border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
          <div className="h-full">
            <LiveKitComponent token={token} height="100%" />
          </div>
        </div>
      )}
      {!token && (
        <div className="h-[280px] border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Connecting to video...
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {question ? question.title : "No Question Loaded"}
                </h2>
                <div className="flex items-center gap-2">
                  {question && (
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    onClick={setNewQuestion}
                    disabled={loadingQuestion}
                  >
                    {loadingQuestion ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {loadingQuestion ? "Loading..." : "Set New Question"}
                  </Button>
                </div>
              </div>
              {question && (
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Question loaded
                  </div>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-6">
              {question ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {question.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Example 1:</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                      <div>
                        <strong>Input:</strong> {question.exampleInputFirst}
                      </div>
                      <div>
                        <strong>Output:</strong> {question.exampleOutputFirst}
                      </div>
                    </div>
                  </div>

                  {question.exampleInputSecond &&
                    question.exampleOutputSecond && (
                      <div>
                        <h3 className="font-semibold mb-3">Example 2:</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                          <div>
                            <strong>Input:</strong>{" "}
                            {question.exampleInputSecond}
                          </div>
                          <div>
                            <strong>Output:</strong>{" "}
                            {question.exampleOutputSecond}
                          </div>
                        </div>
                      </div>
                    )}

                  <div>
                    <h3 className="font-semibold mb-3">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {question.constraints.map((constraint, index) => (
                        <li key={index}>
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No question loaded yet
                  </p>
                  <Button onClick={setNewQuestion} disabled={loadingQuestion}>
                    {loadingQuestion ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {loadingQuestion ? "Loading..." : "Load First Question"}
                  </Button>
                </div>
              )}
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
