import { createFileRoute } from "@tanstack/react-router";
import { NumbersView } from "@/components/numbers-view";

export const Route = createFileRoute("/numbers")({ component: NumbersPage });

function NumbersPage() {
  return <NumbersView />;
}
