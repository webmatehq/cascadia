import { randomUUID } from "crypto";
import { eq, inArray } from "drizzle-orm";
import {
  beerInputSchema,
  defaultContent,
  eventInputSchema,
  upcomingScheduleItemInputSchema,
  upcomingScheduleWeekInputSchema,
  type BeerInput,
  type BeerItem,
  type ContentPayload,
  type EventInput,
  type EventItem,
  type UpcomingScheduleItem,
  type UpcomingScheduleItemInput,
  type UpcomingScheduleWeek,
  type UpcomingScheduleWeekInput,
  type WineInput,
  type WineItem,
  wineInputSchema,
} from "@shared/content";
import { db } from "./db";
import {
  beers,
  eventHighlights,
  events,
  upcomingScheduleItems,
  upcomingScheduleLines,
  upcomingScheduleWeeks,
  wines,
  type BeerRow,
  type EventRow,
  type WineRow,
} from "@shared/schema";

const toNumber = (value: string | number | null | undefined): number | undefined => {
  if (value === null || value === undefined) return undefined;
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatAbv = (value: string | number | null | undefined): string => {
  const numericValue = toNumber(value);
  if (numericValue === undefined) return "";
  return `${numericValue}%`;
};

const parseAbvInput = (value: string): string | null => {
  const normalized = value.replace("%", "").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid ABV value");
  }
  return parsed.toString();
};

const toDbNumberString = (value: number | undefined): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("Numeric value is required");
  }
  return value.toString();
};

const toDbOptionalNumberString = (value: number | undefined): string | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return value.toString();
};

const mapBeer = (record: BeerRow): BeerItem => {
  const price = toNumber(record.price);
  if (price === undefined) {
    throw new Error(`Beer ${record.id} is missing price`);
  }

  return {
    id: record.id,
    name: record.name,
    abv: formatAbv(record.abv),
    price,
  };
};

const mapWine = (record: WineRow): WineItem => ({
  id: record.id,
  name: record.name,
  category: record.category as WineItem["category"],
  glass: toNumber(record.glassPrice),
  bottle: toNumber(record.bottlePrice),
});

const mapEvent = (record: EventRow, highlights: string[]): EventItem => ({
  id: record.id,
  title: record.title,
  description: record.description ?? undefined,
  tagline: record.tagline ?? undefined,
  date: record.dateText,
  time: record.timeText ?? undefined,
  location: record.location,
  highlights,
  backgroundColor: record.backgroundColor ?? undefined,
  borderColor: record.borderColor ?? undefined,
  textColor: record.textColor ?? undefined,
});

const mapScheduleItem = (record: typeof upcomingScheduleItems.$inferSelect, lines: string[]): UpcomingScheduleItem => ({
  id: record.id,
  title: record.title,
  lines,
  sortOrder: record.sortOrder,
});

const listBeers = async (): Promise<BeerItem[]> => {
  const rows = await db.query.beers.findMany({ orderBy: (fields, { asc }) => asc(fields.name) });
  return rows.map(mapBeer);
};

const listWines = async (): Promise<WineItem[]> => {
  const rows = await db.query.wines.findMany({ orderBy: (fields, { asc }) => asc(fields.name) });
  return rows.map(mapWine);
};

const listEvents = async (): Promise<EventItem[]> => {
  const [eventRows, highlightRows] = await Promise.all([
    db.query.events.findMany({ orderBy: (fields, { asc }) => asc(fields.title) }),
    db.query.eventHighlights.findMany(),
  ]);

  const highlightsByEvent = new Map<string, string[]>();
  for (const highlight of highlightRows) {
    const list = highlightsByEvent.get(highlight.eventId) ?? [];
    list.push(highlight.highlight);
    highlightsByEvent.set(highlight.eventId, list);
  }

  return eventRows.map((event) => mapEvent(event, highlightsByEvent.get(event.id) ?? []));
};

const listUpcomingSchedule = async (): Promise<UpcomingScheduleWeek | null> => {
  const [activeWeek] = await db.query.upcomingScheduleWeeks.findMany({
    where: (fields, { eq }) => eq(fields.isActive, true),
    limit: 1,
  });

  if (!activeWeek) {
    return null;
  }

  const items = await db.query.upcomingScheduleItems.findMany({
    where: (fields, { eq }) => eq(fields.weekId, activeWeek.id),
    orderBy: (fields, { asc }) => asc(fields.sortOrder),
  });

  const itemIds = items.map((item) => item.id);
  const lines = itemIds.length
    ? await db.query.upcomingScheduleLines.findMany({
        where: (fields, { inArray }) => inArray(fields.itemId, itemIds),
        orderBy: (fields, { asc }) => asc(fields.sortOrder),
      })
    : [];

  const linesByItem = new Map<string, string[]>();
  for (const line of lines) {
    const list = linesByItem.get(line.itemId) ?? [];
    list.push(line.lineText);
    linesByItem.set(line.itemId, list);
  }

  return {
    id: activeWeek.id,
    weekLabel: activeWeek.weekLabel,
    isActive: activeWeek.isActive,
    items: items.map((item) => mapScheduleItem(item, linesByItem.get(item.id) ?? [])),
  };
};

export const getContent = async (): Promise<ContentPayload> => {
  const [beerList, wineList, eventList, scheduleWeek] = await Promise.all([
    listBeers(),
    listWines(),
    listEvents(),
    listUpcomingSchedule(),
  ]);
  return {
    beers: beerList,
    wines: wineList,
    events: eventList,
    upcomingSchedule: scheduleWeek ?? undefined,
  };
};

export const createBeer = async (input: BeerInput): Promise<BeerItem> => {
  const data = beerInputSchema.parse(input);
  const record = {
    id: randomUUID(),
    name: data.name,
    price: toDbNumberString(data.price),
    abv: parseAbvInput(data.abv),
  };
  await db.insert(beers).values(record);
  return mapBeer(record as BeerRow);
};

export const updateBeer = async (id: string, input: BeerInput): Promise<BeerItem> => {
  const data = beerInputSchema.parse(input);
  const [updated] = await db
    .update(beers)
    .set({
      name: data.name,
      price: toDbNumberString(data.price),
      abv: parseAbvInput(data.abv),
    })
    .where(eq(beers.id, id))
    .returning();
  if (!updated) {
    throw new Error("Beer not found");
  }
  return mapBeer(updated);
};

export const deleteBeer = async (id: string) => {
  const result = await db.delete(beers).where(eq(beers.id, id)).returning();
  if (result.length === 0) {
    throw new Error("Beer not found");
  }
};

const toWineRecord = (id: string, data: WineInput) => ({
  id,
  name: data.name,
  category: data.category,
  glassPrice: toDbOptionalNumberString(data.glass),
  bottlePrice: toDbOptionalNumberString(data.bottle),
});

export const resetBeers = async (): Promise<BeerItem[]> => {
  await db.transaction(async (tx) => {
    await tx.delete(beers);
    const payload = defaultContent.beers.map((beer) => ({
      id: beer.id,
      name: beer.name,
      price: toDbNumberString(beer.price),
      abv: parseAbvInput(beer.abv),
    }));
    await tx.insert(beers).values(payload);
  });
  return listBeers();
};

export const createWine = async (input: WineInput): Promise<WineItem> => {
  const data = wineInputSchema.parse(input);
  const record = toWineRecord(randomUUID(), data);
  await db.insert(wines).values(record);
  return mapWine(record as WineRow);
};

export const updateWine = async (id: string, input: WineInput): Promise<WineItem> => {
  const data = wineInputSchema.parse(input);
  const [updated] = await db.update(wines).set(toWineRecord(id, data)).where(eq(wines.id, id)).returning();
  if (!updated) {
    throw new Error("Wine not found");
  }
  return mapWine(updated);
};

export const deleteWine = async (id: string) => {
  const result = await db.delete(wines).where(eq(wines.id, id)).returning();
  if (result.length === 0) {
    throw new Error("Wine not found");
  }
};

export const resetWines = async (): Promise<WineItem[]> => {
  await db.transaction(async (tx) => {
    await tx.delete(wines);
    const payload = defaultContent.wines.map((wine) => toWineRecord(wine.id, wine));
    await tx.insert(wines).values(payload);
  });
  return listWines();
};

const toEventRecord = (id: string, data: EventInput) => ({
  id,
  title: data.title,
  tagline: data.tagline ?? null,
  description: data.description ?? null,
  dateText: data.date,
  timeText: data.time ?? null,
  location: data.location,
  backgroundColor: data.backgroundColor ?? null,
  borderColor: data.borderColor ?? null,
  textColor: data.textColor ?? null,
});

export const createEvent = async (input: EventInput): Promise<EventItem> => {
  const data = eventInputSchema.parse(input);
  const id = randomUUID();
  const eventRecord = toEventRecord(id, data);

  await db.transaction(async (tx) => {
    await tx.insert(events).values(eventRecord);
    if (data.highlights.length > 0) {
      await tx.insert(eventHighlights).values(
        data.highlights.map((highlight) => ({
          eventId: id,
          highlight,
        }))
      );
    }
  });

  return mapEvent(eventRecord as EventRow, data.highlights);
};

export const updateEvent = async (id: string, input: EventInput): Promise<EventItem> => {
  const data = eventInputSchema.parse(input);
  const eventRecord = toEventRecord(id, data);

  const updated = await db.transaction(async (tx) => {
    const [row] = await tx.update(events).set(eventRecord).where(eq(events.id, id)).returning();
    if (!row) {
      return null;
    }
    await tx.delete(eventHighlights).where(eq(eventHighlights.eventId, id));
    if (data.highlights.length > 0) {
      await tx.insert(eventHighlights).values(
        data.highlights.map((highlight) => ({
          eventId: id,
          highlight,
        }))
      );
    }
    return row;
  });

  if (!updated) {
    throw new Error("Event not found");
  }

  return mapEvent(updated, data.highlights);
};

export const deleteEvent = async (id: string) => {
  const result = await db.delete(events).where(eq(events.id, id)).returning();
  if (result.length === 0) {
    throw new Error("Event not found");
  }
};

export const resetEvents = async (): Promise<EventItem[]> => {
  await db.transaction(async (tx) => {
    await tx.delete(eventHighlights);
    await tx.delete(events);

    const eventPayload = defaultContent.events.map((event) => toEventRecord(event.id, event));
    await tx.insert(events).values(eventPayload);

    const highlightPayload = defaultContent.events.flatMap((event) =>
      event.highlights.map((highlight) => ({
        eventId: event.id,
        highlight,
      }))
    );
    if (highlightPayload.length > 0) {
      await tx.insert(eventHighlights).values(highlightPayload);
    }
  });
  return listEvents();
};

export const resetAll = async (): Promise<ContentPayload> => {
  await db.transaction(async (tx) => {
    await tx.delete(eventHighlights);
    await tx.delete(events);
    await tx.delete(upcomingScheduleLines);
    await tx.delete(upcomingScheduleItems);
    await tx.delete(upcomingScheduleWeeks);
    await tx.delete(wines);
    await tx.delete(beers);

    await tx.insert(beers).values(
      defaultContent.beers.map((beer) => ({
        id: beer.id,
        name: beer.name,
        price: toDbNumberString(beer.price),
        abv: parseAbvInput(beer.abv),
      }))
    );

    await tx.insert(wines).values(defaultContent.wines.map((wine) => toWineRecord(wine.id, wine)));

    await tx.insert(events).values(defaultContent.events.map((event) => toEventRecord(event.id, event)));

    const highlightPayload = defaultContent.events.flatMap((event) =>
      event.highlights.map((highlight) => ({
        eventId: event.id,
        highlight,
      }))
    );
    if (highlightPayload.length > 0) {
      await tx.insert(eventHighlights).values(highlightPayload);
    }

    if (defaultContent.upcomingSchedule) {
      await tx.insert(upcomingScheduleWeeks).values({
        id: defaultContent.upcomingSchedule.id,
        weekLabel: defaultContent.upcomingSchedule.weekLabel,
        isActive: true,
      });
      await tx.insert(upcomingScheduleItems).values(
        defaultContent.upcomingSchedule.items.map((item) => ({
          id: item.id,
          weekId: defaultContent.upcomingSchedule?.id ?? item.id,
          title: item.title,
          sortOrder: item.sortOrder,
        }))
      );
      const linePayload = defaultContent.upcomingSchedule.items.flatMap((item) =>
        item.lines.map((line, index) => ({
          itemId: item.id,
          lineText: line,
          sortOrder: index,
        }))
      );
      if (linePayload.length > 0) {
        await tx.insert(upcomingScheduleLines).values(linePayload);
      }
    }
  });

  return defaultContent;
};

const requireActiveScheduleWeek = async () => {
  const [activeWeek] = await db.query.upcomingScheduleWeeks.findMany({
    where: (fields, { eq }) => eq(fields.isActive, true),
    limit: 1,
  });
  if (activeWeek) {
    return activeWeek;
  }

  const fallbackLabel = defaultContent.upcomingSchedule?.weekLabel ?? "Upcoming Schedule";
  const id = randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(upcomingScheduleWeeks).values({
      id,
      weekLabel: fallbackLabel,
      isActive: true,
    });
    if (defaultContent.upcomingSchedule) {
      await tx.insert(upcomingScheduleItems).values(
        defaultContent.upcomingSchedule.items.map((item) => ({
          id: item.id,
          weekId: id,
          title: item.title,
          sortOrder: item.sortOrder,
        }))
      );
      const linePayload = defaultContent.upcomingSchedule.items.flatMap((item) =>
        item.lines.map((line, index) => ({
          itemId: item.id,
          lineText: line,
          sortOrder: index,
        }))
      );
      if (linePayload.length > 0) {
        await tx.insert(upcomingScheduleLines).values(linePayload);
      }
    }
  });

  return { id, weekLabel: fallbackLabel, isActive: true };
};

export const upsertUpcomingScheduleWeek = async (
  input: UpcomingScheduleWeekInput
): Promise<UpcomingScheduleWeek> => {
  const data = upcomingScheduleWeekInputSchema.parse(input);
  const [activeWeek] = await db.query.upcomingScheduleWeeks.findMany({
    where: (fields, { eq }) => eq(fields.isActive, true),
    limit: 1,
  });

  if (activeWeek) {
    await db
      .update(upcomingScheduleWeeks)
      .set({ weekLabel: data.weekLabel })
      .where(eq(upcomingScheduleWeeks.id, activeWeek.id));
  } else {
    await db.insert(upcomingScheduleWeeks).values({
      id: randomUUID(),
      weekLabel: data.weekLabel,
      isActive: true,
    });
  }

  const scheduleWeek = await listUpcomingSchedule();
  if (!scheduleWeek) {
    throw new Error("Unable to load upcoming schedule");
  }
  return scheduleWeek;
};

export const createUpcomingScheduleItem = async (
  input: UpcomingScheduleItemInput
): Promise<UpcomingScheduleItem> => {
  const data = upcomingScheduleItemInputSchema.parse(input);
  const activeWeek = await requireActiveScheduleWeek();
  const existingItems = await db.query.upcomingScheduleItems.findMany({
    where: (fields, { eq }) => eq(fields.weekId, activeWeek.id),
  });
  const nextSortOrder =
    existingItems.length === 0 ? 0 : Math.max(...existingItems.map((item) => item.sortOrder)) + 1;
  const sortOrder = data.sortOrder ?? nextSortOrder;
  const id = randomUUID();

  await db.transaction(async (tx) => {
    await tx.insert(upcomingScheduleItems).values({
      id,
      weekId: activeWeek.id,
      title: data.title,
      sortOrder,
    });
    if (data.lines.length > 0) {
      await tx.insert(upcomingScheduleLines).values(
        data.lines.map((line, index) => ({
          itemId: id,
          lineText: line,
          sortOrder: index,
        }))
      );
    }
  });

  return {
    id,
    title: data.title,
    lines: data.lines,
    sortOrder,
  };
};

export const updateUpcomingScheduleItem = async (
  id: string,
  input: UpcomingScheduleItemInput
): Promise<UpcomingScheduleItem> => {
  const data = upcomingScheduleItemInputSchema.parse(input);
  const [existing] = await db.query.upcomingScheduleItems.findMany({
    where: (fields, { eq }) => eq(fields.id, id),
    limit: 1,
  });
  if (!existing) {
    throw new Error("Schedule item not found");
  }
  const sortOrder = data.sortOrder ?? existing.sortOrder;

  await db.transaction(async (tx) => {
    await tx
      .update(upcomingScheduleItems)
      .set({ title: data.title, sortOrder })
      .where(eq(upcomingScheduleItems.id, id));
    await tx.delete(upcomingScheduleLines).where(eq(upcomingScheduleLines.itemId, id));
    if (data.lines.length > 0) {
      await tx.insert(upcomingScheduleLines).values(
        data.lines.map((line, index) => ({
          itemId: id,
          lineText: line,
          sortOrder: index,
        }))
      );
    }
  });

  return {
    id,
    title: data.title,
    lines: data.lines,
    sortOrder,
  };
};

export const deleteUpcomingScheduleItem = async (id: string) => {
  const result = await db.delete(upcomingScheduleItems).where(eq(upcomingScheduleItems.id, id)).returning();
  if (result.length === 0) {
    throw new Error("Schedule item not found");
  }
};

export const reorderUpcomingScheduleItems = async (
  items: { id: string; sortOrder: number }[]
) => {
  if (items.length === 0) return;

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(upcomingScheduleItems)
        .set({ sortOrder: item.sortOrder })
        .where(eq(upcomingScheduleItems.id, item.id));
    }
  });
};

export const resetUpcomingSchedule = async (): Promise<UpcomingScheduleWeek> => {
  if (!defaultContent.upcomingSchedule) {
    throw new Error("Default schedule is missing");
  }

  await db.transaction(async (tx) => {
    await tx.delete(upcomingScheduleLines);
    await tx.delete(upcomingScheduleItems);
    await tx.delete(upcomingScheduleWeeks);

    await tx.insert(upcomingScheduleWeeks).values({
      id: defaultContent.upcomingSchedule.id,
      weekLabel: defaultContent.upcomingSchedule.weekLabel,
      isActive: true,
    });
    await tx.insert(upcomingScheduleItems).values(
      defaultContent.upcomingSchedule.items.map((item) => ({
        id: item.id,
        weekId: defaultContent.upcomingSchedule?.id ?? item.id,
        title: item.title,
        sortOrder: item.sortOrder,
      }))
    );
    const linePayload = defaultContent.upcomingSchedule.items.flatMap((item) =>
      item.lines.map((line, index) => ({
        itemId: item.id,
        lineText: line,
        sortOrder: index,
      }))
    );
    if (linePayload.length > 0) {
      await tx.insert(upcomingScheduleLines).values(linePayload);
    }
  });

  return defaultContent.upcomingSchedule;
};
