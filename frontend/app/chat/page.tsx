"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sendChat } from "@/lib/api";

const defaultJobDescription =
  "We are hiring a Senior AI Platform Engineer to build scalable GenAI infrastructure. " +
  "You will own vector search, async APIs, cloud reliability, and mentor engineers.";

const starterPrompts = [
  "Show candidates strong in backend systems and adaptable to GenAI.",
  "Find candidates with startup mindset.",
  "Who has the highest leadership potential?",
  "Find candidates similar to Ava Chen but with stronger frontend expertise."
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: "assistant" | "user"; text: string }>>([
    { role: "assistant", text: "Welcome to Recruiter Copilot. Ask anything about your talent pool." }
  ]);
  const [jobTitle, setJobTitle] = useState("Senior AI Platform Engineer");
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setError("");
    const query = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setStatus("Thinking...");

    try {
      const response = await sendChat({ query, jobTitle: jobTitle || "Role", jobDescription });
      setMessages((prev) => [...prev, { role: "assistant", text: response.answer }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Chat request failed.";
      setError(message);
    } finally {
      setStatus("");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <Card>
        <CardHeader>
          <CardTitle>Recruiter Copilot</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[70vh] flex-col gap-4">
          <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "rounded-2xl bg-cyan-500/10 px-3 py-2 text-cyan-100"
                    : "rounded-2xl bg-white/5 px-3 py-2 text-white/80"
                }
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about candidates" />
            <Button onClick={sendMessage}>Send</Button>
          </div>
          {status ? <p className="text-xs text-cyan-200">{status}</p> : null}
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prompt Ideas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/70">
          <div className="space-y-3">
            <Input
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="Job title"
            />
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Paste job context for chat"
            />
          </div>
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setInput(prompt)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
            >
              {prompt}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
