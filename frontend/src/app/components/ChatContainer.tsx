import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  return (
    <main className="flex-1 overflow-auto p-4">
      <Card className="h-full max-w-4xl mx-auto flex flex-col shadow-sm border-muted">
        <CardHeader className="pb-2">
          <CardTitle>News Collection Intent</CardTitle>
          <CardDescription>
            Let me know what news topics you&apos;re interested in, how often
            you&apos;d like updates, and how you&apos;d prefer the content to be
            analyzed.
          </CardDescription>
          <Separator className="my-2" />
        </CardHeader>

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
