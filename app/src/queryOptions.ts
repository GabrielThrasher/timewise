import { queryOptions } from "@tanstack/react-query";
import { dataClient } from "./dataClient";

export const overviewInfoQueryOptions = queryOptions({
  queryKey: ["overviewInfo"],
  queryFn: () => dataClient.getOverviewInfo(),
});

export const scheduleQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["scheduleInfo", id],
    queryFn: () => dataClient.getSchedule(id),
  });

export const planQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["planInfo", id],
    queryFn: () => dataClient.getPlan(id),
  });
