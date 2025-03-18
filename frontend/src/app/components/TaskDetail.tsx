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
              <h3 className="text-lg font-medium mb-4">Task Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(taskDetail.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Frequency:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {taskDetail.executionInterval}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Analysis:{" "}
                  </span>
                  <span className="text-sm font-medium">
                    {taskDetail.analysisMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      taskDetail.status === "completed"
                        ? "bg-green-500"
                        : taskDetail.status === "failed"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    Status:{" "}
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {taskDetail.status}
                  </span>
                </div>
              </div>
            </div>

            {taskDetail.results && taskDetail.results.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Latest Results</h3>

                {taskDetail.results.map((result, index) => (
                  <div key={index} className="bg-card rounded-lg p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        {new Date(result.date).toLocaleDateString()}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(result.date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-medium mb-2">Summary</h5>
                      <p className="text-sm text-muted-foreground">
                        {result.summary}
                      </p>
                    </div>

                    {result.articles.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium mb-3">
                          Related Articles
                        </h5>
                        <div className="space-y-3">
                          {result.articles.map((article, articleIndex) => (
                            <a
                              key={articleIndex}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                            >
                              <h6 className="font-medium mb-1">
                                {article.title}
                              </h6>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{article.source}</span>
                                <span>
                                  {new Date(
                                    article.publishDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  This task hasn&apos;t been executed yet or no results are
                  available.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Select a task to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
