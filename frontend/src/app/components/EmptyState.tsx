import { Bot } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Bot className="h-12 w-12 mb-4 text-muted-foreground" />
      <h2 className="text-xl font-semibold mb-2">欢迎使用新闻助手</h2>
      <p className="text-muted-foreground max-w-md">
        告诉我你感兴趣的新闻主题，你希望多久更新一次，以及你希望如何分析内容。
      </p>
    </div>
  );
} 