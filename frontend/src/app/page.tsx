"use client";

import { useState, useEffect } from "react";
import TaskSidebar from "./components/TaskSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatContainer from "./components/ChatContainer";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Task = {
  id: string;
  keywords: string;
  executionInterval: string;
  analysisMethod: string;
  createdAt: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = (await response.json()) as Task[];
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          conversationId: conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Save conversation ID
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If task was collected, refresh task list
      if (data.taskCollected) {
        const newTask = {
          id: Date.now().toString(),
          keywords: "New keywords",
          executionInterval: "Daily",
          analysisMethod: "Summary",
          createdAt: new Date().toISOString(),
        };

        setTasks((prev) => [...prev, newTask]);
      }
    } catch (error) {
      console.error("Error:", error);

      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
    setSelectedTask(null);
  };

  const selectTask = (taskId: string) => {
    setSelectedTask(taskId);
    // Here you could load the task details or related conversation
  };

  return (
    <div className="flex h-screen bg-background">
      <TaskSidebar
        tasks={tasks}
        selectedTask={selectedTask}
        selectTask={selectTask}
        resetConversation={resetConversation}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          resetConversation={resetConversation}
          isLoading={isLoading}
        />

        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
