import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2 } from "lucide-react";
import { Message } from "../page";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3 p-4 rounded-lg bg-accent/20 mr-12">
          <Avatar className="bg-accent">
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing your request...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
