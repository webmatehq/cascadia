import { Beer, Percent, Wine } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useContent } from "@/hooks/useContent";
import type { WineCategory } from "@shared/content";

const categories: WineCategory[] = ["Whites", "Rosé", "Reds", "Wine Cocktails"];


const BeerListSection = () => {
  const { data, isLoading, isError } = useContent();
  const beers = data?.beers ?? [];
  const wines = data?.wines ?? [];

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

          <p className="text-gray-600 mb-8 mt-4">
            Explore our rotating selection of craft beers, ciders, and wines.
          </p>

          <TabsContent value="beers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {isLoading ? (
                <p className="text-gray-500 text-left">Actualizando lista...</p>
              ) : isError ? (
                <p className="text-red-500 text-left">
                  No pudimos cargar el menú. Intenta nuevamente en unos minutos.
                </p>
              ) : beers.length === 0 ? (
                <p className="text-gray-500 text-left">Todavía no hay cervezas publicadas.</p>
              ) : (
                beers.map((beer) => (
                  <div
                  key={beer.id}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Beer className="w-5 h-5 text-[#D9A566]" />
                    {beer.name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-gray-700 text-sm">
                    <span className="flex items-center">
                      <Percent className="w-4 h-4 mr-1 text-[#D9A566]" />
                      {beer.abv}
                    </span>
                    {/* {typeof beer.price === "number" && (
                      <span className="font-semibold text-gray-900">${beer.price.toFixed(2)}</span>
                    )} */}
                  </div>
                </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="wines">
            <div className="text-left">
              {isLoading && <p className="text-gray-500">Cargando vinos...</p>}
              {isError && (
                <p className="text-red-500">No pudimos cargar los vinos. Intenta más tarde.</p>
              )}
              {!isLoading &&
                !isError &&
                categories.map((category) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {wines
                        .filter((w) => w.category === category)
                        .map((wine) => (
                          <div
                            key={wine.id}
                            className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm"
                          >
                            <div className="flex items-center gap-2 justify-between">
                              <div className="flex items-center gap-2">
                                <Wine className="w-4 h-4 text-[#D9A566]" />
                                <p className="text-lg font-semibold text-gray-900">{wine.name}</p>
                              </div>
                              <div className="text-sm text-gray-700 space-y-1 text-right">
                                {typeof wine.glass === "number" && (
                                  <p>
                                    <span className="font-semibold">${wine.glass.toFixed(2)}</span>{" "}
                                    <span className="text-xs uppercase tracking-wide">Glass</span>
                                  </p>
                                )}
                                {typeof wine.bottle === "number" && (
                                  <p>
                                    <span className="font-semibold">${wine.bottle.toFixed(2)}</span>{" "}
                                    <span className="text-xs uppercase tracking-wide">Bottle</span>
                                  </p>
                                )}
                              </div>
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
