import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import {
  beerInputSchema,
  defaultContent,
  eventInputSchema,
  type BeerInput,
  type BeerItem,
  type ContentPayload,
  type EventInput,
  type EventItem,
  type WineInput,
  type WineItem,
  wineInputSchema,
} from "@shared/content";
import { db } from "./db";
import {
  beers,
  eventHighlights,
  events,
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

export const getContent = async (): Promise<ContentPayload> => {
  const [beerList, wineList, eventList] = await Promise.all([listBeers(), listWines(), listEvents()]);
  return { beers: beerList, wines: wineList, events: eventList };
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
  });

  return defaultContent;
};
