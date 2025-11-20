import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface BeerItem {
  name: string;
  abv: string;
  price?: number;
}

interface BeerListContextValue {
  beers: BeerItem[];
  addBeer: (beer: BeerItem) => void;
  updateBeer: (index: number, beer: BeerItem) => void;
  removeBeer: (index: number) => void;
  resetBeers: () => void;
}

const STORAGE_KEY = "cascadia.beers";

const defaultBeers: BeerItem[] = [
  { name: "Kettle House Scotch Ale", price: 5, abv: "6.5%" },

  { name: "Bale Breaker Dormancy Breakfast Stout", price: 8.5, abv: "6.8%" },
  { name: "No-Li Cascade Fog Hazy IPA", price: 8.5, abv: "7.5%" },
  { name: "Union Hill Whiskey Business Cider", price: 8.5, abv: "8.5%" },
  { name: "DRU BRU Hazy Session", price: 8.5, abv: "5.1%" },
  { name: "Single Hill Adams Pilsner", price: 8.5, abv: "4.8%" },
  { name: "New Belgium Dominga Grapefruit Paloma Sour", price: 8.5, abv: "8%" },
  { name: "Seattle Cider Honey Crisp", price: 8.5, abv: "5.5%" },

  { name: "Burwood Hop Locker IPA", price: 5, abv: "6.4%" },

  // Columna derecha
  { name: "Icicle Dirty Face Amber Lager", price: 8.5, abv: "5%" },
  { name: "Busch Light", price: 6.5, abv: "4.1%" },
  { name: "Schilling Moonberries Cider", price: 8.5, abv: "5.2%" },
  { name: "Bale Breaker Green Rush Fresh Hops", price: 8.5, abv: "6.9%" },
  { name: "Backwoods Brewing S'mores Stout", price: 8.5, abv: "5.5%" },
  { name: "Doghaus Brewery Rover's Irish Red", price: 8.5, abv: "5%" },
  { name: "Old School House Hooligan Stout", price: 8.5, abv: "7%" },
  { name: "Fort George Vortex IPA", price: 8.5, abv: "7.2%" },
];


const BeerListContext = createContext<BeerListContextValue | undefined>(undefined);

const readFromStorage = (): BeerItem[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as BeerItem[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
};

export function BeerListProvider({ children }: { children: ReactNode }) {
  const [beers, setBeers] = useState<BeerItem[]>(() => readFromStorage() ?? defaultBeers);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(beers));
    } catch {
      // Ignored: localStorage may be unavailable (e.g., private mode)
    }
  }, [beers]);

  const value = useMemo<BeerListContextValue>(
    () => ({
      beers,
      addBeer: (beer) => setBeers((prev) => [...prev, beer]),
      updateBeer: (index, beer) =>
        setBeers((prev) => prev.map((item, idx) => (idx === index ? beer : item))),
      removeBeer: (index) => setBeers((prev) => prev.filter((_, idx) => idx !== index)),
      resetBeers: () => setBeers([...defaultBeers]),
    }),
    [beers]
  );

  return <BeerListContext.Provider value={value}>{children}</BeerListContext.Provider>;
}

export function useBeerList() {
  const context = useContext(BeerListContext);
  if (!context) {
    throw new Error("useBeerList must be used within a BeerListProvider");
  }
  return context;
}

export { defaultBeers };
