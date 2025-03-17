import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Message } from "../page";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        message.role === "user" ? "bg-muted ml-12" : "bg-accent/20 mr-12"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8",
        message.role === "user" ? "bg-primary" : "bg-accent"
      )}>
        <AvatarFallback>
          {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="mb-1 font-medium">
          {message.role === "user" ? "You" : "AI Assistant"}
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        
        {message.role === "assistant" &&
        message.content.includes("Intent collected successfully") && (
          <Badge className="mt-2 bg-green-500 hover:bg-green-600">
            ✅ Collection successful
          </Badge>
        )}
        
        <div className="mt-2 text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
} 