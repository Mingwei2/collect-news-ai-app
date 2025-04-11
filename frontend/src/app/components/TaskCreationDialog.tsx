import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Task } from "../page";

interface TaskCreationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	progress: number;
	newTaskId: string | null;
	tasks: Task[];
	onViewDetails: (taskId: string) => void;
}

export default function TaskCreationDialog({
	open,
	onOpenChange,
	progress,
	newTaskId,
	tasks,
	onViewDetails
}: TaskCreationDialogProps) {
	const newTask = tasks.find(t => t.id === newTaskId);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md" hideCloseButton>
				<DialogHeader>
					<DialogTitle className="text-center">任务创建中</DialogTitle>
					<DialogDescription className="text-center">
						{progress < 100 ? (
							"正在创建您的信息收集任务..."
						) : (
							<div className="flex flex-col items-center">
								<CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
								<span>任务创建成功！</span>
							</div>
						)}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<div className="space-y-2">
						<p className="text-sm font-medium">收集进度</p>
						<Progress value={progress} className="h-2" />
						<p className="text-xs text-right text-muted-foreground">{progress}%</p>
					</div>

					{progress >= 100 && newTask && (
						<>
							<div className="bg-muted p-4 rounded-lg">
								<p className="text-sm font-medium mb-2">任务信息</p>
								<div className="text-sm space-y-1">
									<div className="flex">
										<span className="text-muted-foreground">关键词：</span>
										<span className="ml-1">{newTask.keywords}</span>
									</div>
									<div className="flex">
										<span className="text-muted-foreground">执行频率：</span>
										<span className="ml-1">{newTask.executionInterval}</span>
									</div>
									<div className="flex">
										<span className="text-muted-foreground">分析方法：</span>
										<span className="ml-1">{newTask.analysisMethod}</span>
									</div>
								</div>
							</div>

							<div className="flex justify-center">
								<Button
									onClick={() => {
										onOpenChange(false);
										onViewDetails(newTaskId || "");
									}}
									className="bg-primary text-primary-foreground"
								>
									查看任务详情
								</Button>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
} 