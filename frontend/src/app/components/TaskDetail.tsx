import { Calendar, Clock, BarChart2 } from "lucide-react";
import { TaskDetail as TaskDetailType } from "../page";
import { formatDistanceToNow } from "date-fns";

interface TaskDetailProps {
  taskDetail: TaskDetailType | null;
  isLoading: boolean;
}

export default function TaskDetail({ taskDetail, isLoading }: TaskDetailProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-border p-4 flex items-center">
        <h2 className="text-xl font-semibold">{taskDetail?.keywords}</h2>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : taskDetail ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium mb-4">任务信息</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    创建时间:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(taskDetail.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    执行频率:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {taskDetail.executionInterval}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    分析方法:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {taskDetail.analysisMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${taskDetail.status === "completed"
                        ? "bg-green-500"
                        : taskDetail.status === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    状态:{" "}
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {taskDetail.status}
                  </span>
                </div>
              </div>
            </div>

            {taskDetail.results && taskDetail.results.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">最新结果</h3>

                {taskDetail.results.map((result, index) => (
                  <div key={index} className="bg-card rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        {new Date(result.createdAt).toLocaleString()}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(result.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground">
                        {result.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">暂无结果</h3>
                <p className="text-muted-foreground">
                  该任务尚未执行或暂无结果。
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              请选择一个任务查看详情
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
