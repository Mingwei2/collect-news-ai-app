import { Bot } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
      <h2 className="text-xl font-semibold mb-2">Welcome to AI News Assistant</h2>
      <p className="text-muted-foreground max-w-md">
        Start by telling me what kind of news you&apos;d like to track, how often, and your preferred analysis method.
      </p>
    </div>
  );
} 