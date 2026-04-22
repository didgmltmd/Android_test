import { Card } from "./ui/Card";

export function LoadingState() {
  return (
    <Card className="space-y-4">
      <div className="h-5 w-40 animate-pulse rounded-full bg-gray-100" />
      <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
    </Card>
  );
}
