import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useEffect } from "react";
import MessageList from "./MessageList";
import EmptyState from "./EmptyState";
import { Message } from "../page";
import ChatInput from "./ChatInput";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (message: string) => Promise<void>;
}

export default function ChatContainer({
  messages,
  isLoading,
  input,
  setInput,
  handleSubmit,
}: ChatContainerProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 50);
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  return (
    <main className="flex-1 overflow-auto p-4">
      <Card className="h-full max-w-4xl mx-auto flex flex-col shadow-sm border-muted">

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea ref={scrollAreaRef} className="h-full p-6">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </CardFooter>
      </Card>
    </main>
  );
}
