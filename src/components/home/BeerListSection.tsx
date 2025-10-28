import { Beer, Percent, Wine } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBeerList } from "@/context/BeerListContext";

type WineCategory = "Whites" | "Reds" | "Rosé";

interface WineItem {
  name: string;
  glass?: number; // price per glass
  bottle?: number; // price per bottle
  category: WineCategory;
}

const wines: WineItem[] = [
  // Whites
  { name: "Silver Bell Sauv Blanc", glass: 11, bottle: 30, category: "Whites" },
  { name: "Fielding Hills Chenin Blanc", glass: 13, bottle: 42, category: "Whites" },
  { name: "Fielding Hills Chardonnay", glass: 13, bottle: 42, category: "Whites" },
  { name: "Fielding Hills Roussane", glass: 14, bottle: 46, category: "Whites" },
  { name: "Treveri Sparkling", bottle: 30, category: "Whites" },
  { name: "Silver Bell Cab Blanc", glass: 12, bottle: 30, category: "Whites" },

  // Rosé
  { name: "Silver Bell Rosé", glass: 11, bottle: 30, category: "Rosé" },
  { name: "Fielding Hills Rosé", glass: 14, bottle: 42, category: "Rosé" },

  // Reds
  { name: "Silver Bell Stormy", glass: 14, bottle: 42, category: "Reds" },
  { name: "Silver Bell Cab Sauv", glass: 14, bottle: 44, category: "Reds" },
  { name: "Fielding Hills Syrah", bottle: 60, category: "Reds" },
  { name: "Fielding Hills 2 Glaciers", glass: 14, bottle: 42, category: "Reds" },
  { name: "Silver Bell Malbec", glass: 15, bottle: 46, category: "Reds" },
  { name: "Silver Bell Petit Verdot", glass: 14, bottle: 44, category: "Reds" },
];

const BeerListSection = () => {
  const { beers } = useBeerList();

  return (
    <section id="beerlist" className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <Tabs defaultValue="beers" className="w-full">
          <TabsList className="bg-transparent p-0 inline-flex gap-10 md:gap-14 justify-center">
            <TabsTrigger
              value="beers"
              className="bg-transparent px-0 py-0 rounded-none text-3xl md:text-4xl font-bold text-gray-800 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D9A566]"
            >
              Beers on Tap
            </TabsTrigger>
            <TabsTrigger
              value="wines"
              className="bg-transparent px-0 py-0 rounded-none text-3xl md:text-4xl font-bold text-gray-800 data-[state=active]:text-gray-900 data-[state=active]:border-b-4 data-[state=active]:border-[#D9A566]"
            >
              Wines
            </TabsTrigger>
          </TabsList>

          <p className="text-gray-600 mb-8 mt-4">Explore our rotating selection of craft beers, ciders, and wines.</p>

          <TabsContent value="beers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {beers.map((beer, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Beer className="w-5 h-5 text-[#D9A566]" />
                    {beer.name}
                  </h3>
                  <div className="flex items-center text-gray-700 text-sm">
                    <Percent className="w-4 h-4 mr-1 text-[#D9A566]" />
                    {beer.abv}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wines">
            <div className="text-left">
              {(["Whites", "Rosé", "Reds"] as WineCategory[]).map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wines
                      .filter((w) => w.category === category)
                      .map((wine, idx) => (
                        <div
                          key={`${category}-${idx}`}
                          className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Wine className="w-4 h-4 text-[#D9A566]" />
                            <p className="text-lg font-semibold text-gray-900">{wine.name}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default BeerListSection;
