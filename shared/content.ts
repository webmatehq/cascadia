import { z } from "zod";

export const wineCategorySchema = z.enum(["Whites", "Rosé", "Reds", "Wine Cocktails"]);
export type WineCategory = z.infer<typeof wineCategorySchema>;

export const beerInputSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  abv: z.string().min(1, "El porcentaje de alcohol es obligatorio"),
  price: z.number().min(0, "El precio es obligatorio"),
});
export type BeerInput = z.infer<typeof beerInputSchema>;

export const beerItemSchema = beerInputSchema.extend({
  id: z.string(),
});
export type BeerItem = z.infer<typeof beerItemSchema>;

export const wineInputSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: wineCategorySchema,
  glass: z.number().optional(),
  bottle: z.number().optional(),
});
export type WineInput = z.infer<typeof wineInputSchema>;

export const wineItemSchema = wineInputSchema.extend({
  id: z.string(),
});
export type WineItem = z.infer<typeof wineItemSchema>;

export const eventInputSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  tagline: z.string().optional(),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().optional(),
  location: z.string().min(1, "La ubicación es obligatoria"),
  highlights: z.array(z.string()).default([]),
  backgroundColor: z.string().optional(),
  borderColor: z.string().optional(),
  textColor: z.string().optional(),
});
export type EventInput = z.infer<typeof eventInputSchema>;

export const eventItemSchema = eventInputSchema.extend({
  id: z.string(),
});
export type EventItem = z.infer<typeof eventItemSchema>;

export const upcomingScheduleItemInputSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  lines: z.array(z.string().min(1)).default([]),
  sortOrder: z.number().int().nonnegative().optional(),
});
export type UpcomingScheduleItemInput = z.infer<typeof upcomingScheduleItemInputSchema>;

export const upcomingScheduleItemSchema = upcomingScheduleItemInputSchema.extend({
  id: z.string(),
  sortOrder: z.number().int().nonnegative(),
});
export type UpcomingScheduleItem = z.infer<typeof upcomingScheduleItemSchema>;

export const upcomingScheduleWeekInputSchema = z.object({
  weekLabel: z.string().min(1, "El texto de la semana es obligatorio"),
  isActive: z.boolean().optional(),
});
export type UpcomingScheduleWeekInput = z.infer<typeof upcomingScheduleWeekInputSchema>;

export const upcomingScheduleWeekSchema = upcomingScheduleWeekInputSchema.extend({
  id: z.string(),
  isActive: z.boolean(),
  items: z.array(upcomingScheduleItemSchema),
});
export type UpcomingScheduleWeek = z.infer<typeof upcomingScheduleWeekSchema>;

export const contentSchema = z.object({
  beers: z.array(beerItemSchema),
  wines: z.array(wineItemSchema),
  events: z.array(eventItemSchema),
  upcomingSchedule: upcomingScheduleWeekSchema.optional(),
});
export type ContentPayload = z.infer<typeof contentSchema>;

export const defaultBeers: BeerItem[] = [
  { id: "beer-1", name: "Kettle House Scotch Ale", price: 8.5, abv: "6.5%" },
  { id: "beer-2", name: "Bale Breaker Dormancy breakfast stout", price: 8.5, abv: "6.8%" },
  { id: "beer-3", name: "Hofbräu Original", price: 8.5, abv: "5.1%" },
  { id: "beer-4", name: "Old Schoolhouse Fresh Hop", price: 8.5, abv: "7.0%" },
  { id: "beer-5", name: "DRU BRU Hazy Sensation", price: 8.5, abv: "5.1%" },
  { id: "beer-6", name: "Georgetown Tavern", price: 8.5, abv: "4.9%" },
  { id: "beer-7", name: "Reuben’s Brews Hazealicious IPA", price: 8.5, abv: "6%" },
  { id: "beer-8", name: "Seattle Cider Honey Crisp", price: 8.5, abv: "5.5%" },
  { id: "beer-9", name: "Icicle Dirty Face Amber Lager", price: 8.5, abv: "5.0%" },
  { id: "beer-10", name: "Busch Light", price: 6.5, abv: "4.1%" },
  { id: "beer-11", name: "Hofbräu Dunkel", price: 8.5, abv: "5.5%" },
  { id: "beer-12", name: "Black Raven Brewing Perpelox Pale Ale", price: 8.5, abv: "5.3%" },
  { id: "beer-13", name: "Old School House Hooligan Stout", price: 8.5, abv: "5.5%" },
  { id: "beer-14", name: "Doghaus River's Irish Red", price: 8.5, abv: "5%" },
  { id: "beer-15", name: "Bale Breaker Topcutter IPA", price: 8.5, abv: "6.8%" },
  { id: "beer-16", name: "Burwood Hop Locker IPA", price: 8.5, abv: "6.4%" },
];

export const defaultWines: WineItem[] = [
  // Whites
  { id: "wine-1", name: "Horan Estates Sauv Blanc", glass: 11, bottle: 30, category: "Whites" },
  { id: "wine-2", name: "Malaga Springs Winery White Blend", glass: 13, bottle: 36, category: "Whites" },
  { id: "wine-3", name: "Fielding Hills Chardonnay", glass: 14, bottle: 42, category: "Whites" },
  { id: "wine-4", name: "Silver Bell Cab Blanc", glass: 12, bottle: 30, category: "Whites" },
  { id: "wine-5", name: "Treveri Sparkling", glass: undefined, bottle: 30, category: "Whites" },

  // Reds
  { id: "wine-6", name: "Silver Bell Stormy", glass: 14, bottle: 42, category: "Reds" },
  { id: "wine-7", name: "Silver Bell Cab Sauv", glass: 14, bottle: 44, category: "Reds" },
  { id: "wine-8", name: "Fielding Hills Syrah", glass: undefined, bottle: 60, category: "Reds" },
  { id: "wine-9", name: "Fielding Hills 2 Glaciers", glass: 14, bottle: 42, category: "Reds" },
  { id: "wine-10", name: "Silver Bell Malbec", glass: 14, bottle: 46, category: "Reds" },
  { id: "wine-11", name: "Silver Bell Petit Verdot", glass: 14, bottle: 44, category: "Reds" },

  // Rosé
  { id: "wine-12", name: "Malaga Springs Winery Syrah Rosé", glass: 13, bottle: 36, category: "Rosé" },
  { id: "wine-13", name: "Silver Bell Rosé", glass: 11, bottle: 30, category: "Rosé" },
  { id: "wine-14", name: "Fielding Hills Rosé", glass: 14, bottle: 42, category: "Rosé" },

  // Wine Cocktails
  { id: "wine-15", name: "Sangria", glass: 8, bottle: undefined, category: "Wine Cocktails" },
  { id: "wine-16", name: "Margaritas", glass: 8, bottle: undefined, category: "Wine Cocktails" },
  { id: "wine-17", name: "Buzzballs", glass: 5, bottle: undefined, category: "Wine Cocktails" },
];

export const defaultEvents: EventItem[] = [
  {
    id: "event-1",
    title: "Connecting Hearts — Ages 55+ Singles Night Out",
    tagline: "(a fun alternative to dating apps)",
    description:
      "Unwind with other Wenatchee Valley singles 55+ over local drinks, small bites, and easygoing vibes.",
    date: "Friday, October 10, 2025",
    location: "624 S Augustin Loop, East Wenatchee",
    highlights: [
      "Local wines, craft beers & cider",
      "Sangria & margaritas",
      "Charcuterie boxes & light snacks",
      "Gift basket raffle",
      "Fun, laughter & no-pressure vibes",
    ],
    backgroundColor: "#F7EFE4",
    borderColor: "#E6D6BF",
    textColor: "#6B1B1B",
  },
  {
    id: "event-2",
    title: "Howl-O-Ween Dog Costume Red Carpet Fashion Show",
    description:
      "Bring your pup in costume and enjoy a fall afternoon packed with games, prizes, and good food.",
    date: "Saturday, October 25th",
    time: "Noon – 4 PM",
    location: "Cascadia Taphouse, East Wenatchee, Washington",
    highlights: [
      "Games and a dog treat bar",
      "Prizes for the best Howl-O-Ween dog costume",
      "Sammies and Hammies food truck",
      "Dog-friendly event",
    ],
    backgroundColor: "#807A75",
    textColor: "#FFFFFF",
  },
];

export const defaultUpcomingSchedule: UpcomingScheduleWeek = {
  id: "schedule-week-1",
  weekLabel: "Week of 1/12 to 1/18",
  isActive: true,
  items: [
    {
      id: "schedule-item-1",
      title: "Sun - Thurs",
      lines: ["Raffle tickets for Mariners game with each 16oz draft pour"],
      sortOrder: 0,
    },
    {
      id: "schedule-item-2",
      title: "Thursday, 15th",
      lines: ["Trades Appreciation Day 5pm-8pm", "Food truck on site", "@dirtyapronfood"],
      sortOrder: 1,
    },
    {
      id: "schedule-item-3",
      title: "Friday, 16th",
      lines: ["Latin Night at 9pm with @whois_jg", "DJ Trippy Kitty", "Food truck on site", "@dirtyapronfood"],
      sortOrder: 2,
    },
    {
      id: "schedule-item-4",
      title: "Saturday, 17th",
      lines: ["NFL Playoffs", "Food truck on site", "@dirtyapronfood"],
      sortOrder: 3,
    },
    {
      id: "schedule-item-5",
      title: "Sunday, 18th",
      lines: ["NFL Playoffs"],
      sortOrder: 4,
    },
  ],
};

export const defaultContent: ContentPayload = {
  beers: defaultBeers,
  wines: defaultWines,
  events: defaultEvents,
  upcomingSchedule: defaultUpcomingSchedule,
};
