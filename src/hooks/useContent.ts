import { useQuery } from "@tanstack/react-query";
import type { ContentPayload } from "@shared/content";

export function useContent() {
  return useQuery<ContentPayload>({
    queryKey: ["/api/content"],
  });
}
