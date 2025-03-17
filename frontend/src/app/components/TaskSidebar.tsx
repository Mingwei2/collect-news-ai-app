import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../page";

interface TaskSidebarProps {
  tasks: Task[];
  selectedTask: string | null;
  selectTask: (taskId: string) => void;
  resetConversation: () => void;
}

export default function TaskSidebar({
  tasks,
  selectedTask,
  selectTask,
  resetConversation,
}: TaskSidebarProps) {
  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          News Tasks
        </h2>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          <Button 
            variant="outline" 
            className="w-full mb-4 justify-start" 
            onClick={resetConversation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Button>
          
          {tasks.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground text-sm">
              No tasks yet. Start a conversation to create one.
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={cn(
                    "p-3 rounded-md cursor-pointer hover:bg-accent/80 transition-colors",
                    selectedTask === task.id ? "bg-accent text-accent-foreground" : "bg-card"
                  )}
                  onClick={() => selectTask(task.id)}
                >
                  <div className="font-medium truncate">{task.keywords}</div>
                  <div className="text-xs text-muted-foreground flex justify-between mt-1">
                    <span>{task.executionInterval}</span>
                    <span>{task.analysisMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
} 