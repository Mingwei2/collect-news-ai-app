import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bot, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  resetConversation: () => void;
  isLoading: boolean;
}

export default function ChatHeader({ resetConversation, isLoading }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI News Assistant
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetConversation}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
} 