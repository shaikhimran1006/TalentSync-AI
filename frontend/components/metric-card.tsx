import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function MetricCard({
  title,
  value,
  trend,
  progress
}: {
  title: string;
  value: string;
  trend: string;
  progress: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-white/60">{trend}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="font-display text-3xl text-white">{value}</p>
          <p className="text-xs text-cyan-200">{Math.round(progress * 100)}% benchmark</p>
        </div>
        <div className="mt-4">
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  );
}
