import { createFileRoute } from "@tanstack/react-router";
import { DoorView } from "@/components/door-view";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <DoorView />;
}
