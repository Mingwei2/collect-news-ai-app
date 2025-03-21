"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TaskSidebar from "./components/TaskSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatContainer from "./components/ChatContainer";
import TaskDetail from "./components/TaskDetail";

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

export type TaskDetail = {
  id: string;
  keywords: string;
  executionInterval: string;
  analysisMethod: string;
  createdAt: string;
  status: "pending" | "completed" | "failed";
  lastExecuted?: string;
  results?: Array<{
    date: string;
    summary: string;
    articles: Array<{
      title: string;
      url: string;
      source: string;
      publishDate: string;
    }>;
  }>;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [isTaskDetailLoading, setIsTaskDetailLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsTasksLoading(true);
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = (await response.json()) as Task[];
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const taskId = searchParams.get("taskId");
    if (taskId) {
      selectTask(taskId);
    }
  }, [searchParams]);

  const handleSubmit = async (message: string) => {
    if (!message.trim()) return;

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
          message: input,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.taskCollected) {
        const newTask = data.task;
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
    setTaskDetail(null);
    router.push("/");
  };

  const selectTask = async (taskId: string) => {
    setSelectedTask(taskId);
    setIsTaskDetailLoading(true);
    router.push(`?taskId=${taskId}`);

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`);

      if (!response.ok) {
        setIsTaskDetailLoading(false);
        setSelectedTask(null);
        router.push("/");
      }

      const data = await response.json();
      setTaskDetail(data);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setIsTaskDetailLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <TaskSidebar
        tasks={tasks}
        isLoading={isTasksLoading}
        selectedTask={selectedTask}
        selectTask={selectTask}
        resetConversation={resetConversation}
      />

      <div className="flex-1 flex flex-col">
        {selectedTask ? (
          <TaskDetail taskDetail={taskDetail} isLoading={isTaskDetailLoading} />
        ) : isTasksLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
