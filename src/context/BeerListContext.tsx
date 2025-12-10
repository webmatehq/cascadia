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
  { name: "One Tree Huckleberry Cider", price: 8.5, abv: "6.8%" },
  { name: "Reuben's Hazelicious Hazy IPA", price: 8.5, abv: "6%" },
  { name: "No-Li Cascade Fog Hazy IPA", price: 8.5, abv: "7.5%" },
  { name: "Onion Hill Whiskey Business Cider", price: 8.5, abv: "8.5%" },
  { name: "DRU BRU Hazy Session Hazy IPA", price: 8.5, abv: "5.1%" },
  { name: "PFriem Pilsner", price: 8.5, abv: "4.9%" },
  { name: "New Belgium Dominga Grapefruit Paloma Sour", price: 8.5, abv: "8%" },
  { name: "Seattle Cider Honey Crisp", price: 8.5, abv: "5.5%" },
  { name: "Old Schoolhouse Methow Blonde Ale", price: 8.5, abv: "5.0%" },

  // Right column
  { name: "Boneyard RPM IPA", price: 8.5, abv: "6.5%" },
  { name: "Busch Light", price: 6.5, abv: "4.1%" },
  { name: "Doghaus Brewery Double Dog Double IPA", price: 8.5, abv: "8%" },
  { name: "Bale Breaker Dormancy Breakfast Stout", price: 8.5, abv: "6.8%" },
  { name: "Backwoods Brewing Morning Stout", price: 8.5, abv: "5.5%" },
  { name: "Fort George Vortex IPA", price: 8.5, abv: "7.2%" },
  { name: "Iron Goat Brewing Goatmeal Stout", price: 8.5, abv: "5.6%" },
  { name: "Crucible Brewing Pilsner", price: 8.5, abv: "5%" },
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
  const [beers, setBeers] = useState<BeerItem[]>(() => defaultBeers);

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
