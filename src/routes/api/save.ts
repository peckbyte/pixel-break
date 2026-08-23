import { createFileRoute } from "@tanstack/react-router";
import { handleSave } from "@/game/cloudSave";

const handle = ({ request }: { request: Request }) => handleSave(request);

export const Route = createFileRoute("/api/save")({
  server: { handlers: { GET: handle, POST: handle } },
});
