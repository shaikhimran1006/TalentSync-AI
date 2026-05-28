import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiInsight({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/70">{body}</p>
      </CardContent>
    </Card>
  );
}
