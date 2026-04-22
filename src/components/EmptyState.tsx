import { Card } from "./ui/Card";

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <Card className="text-center">
      <div className="space-y-2 py-6">
        <p className="text-lg font-semibold text-toss-text">{title}</p>
        <p className="text-sm leading-relaxed text-toss-muted">{description}</p>
      </div>
    </Card>
  );
}
