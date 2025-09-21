import { Beer, Percent, DollarSign } from "lucide-react";

const beers = [
  { name: "Kettle House Scotch Ale", price: 8.5, abv: "6.5%" },
  { name: "Burwood Pilsner", price: 8.5, abv: "4.9%" },
  { name: "Hofbräu Original", price: 8.5, abv: "5.1%" },
  { name: "Dru Bru Kölsch", price: 8.5, abv: "5.0%" },
  { name: "No-Li Cascade Fog", price: 8.5, abv: "7.5%" },
  { name: "Georgetown Tavern", price: 8.5, abv: "4.9%" },
  { name: "pFriem Mexican Lager", price: 8.5, abv: "4.6%" },
  { name: "Seattle Cider Honey Crisp", price: 8.5, abv: "5.5%" },
  { name: "Icicle Dirty Face Amber", price: 8.5, abv: "5.0%" },
  { name: "Busch Light", price: 6.5, abv: "4.1%" },
  { name: "Hofbräu Dunkel", price: 8.5, abv: "5.5%" },
  { name: "Dru Bru Hazy IPA", price: 8.5, abv: "5.1%" },
  { name: "Bale Breaker Breakfast Stout", price: 8.5, abv: "6.8%" },
  { name: "pFriem Hazy IPA", price: 8.5, abv: "6.8%" },
  { name: "Oddstock Cider", price: 8.5, abv: "6.6%" },
  { name: "Bale Breaker Topcutter IPA", price: 8.5, abv: "6.8%" },
];

const BeerListSection = () => {
  return (
    <section id="beerlist" className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Beers on Tap</h2>
        <div className="w-24 h-1 bg-[#D9A566] mx-auto mb-6 rounded" />

        <p className="text-gray-600 mb-8">
          Explore our rotating selection of craft beers and ciders.
        </p>

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
              <div className="flex items-center text-gray-700 text-sm mb-1">
                <DollarSign className="w-4 h-4 mr-1 text-[#D9A566]" />
                ${beer.price.toFixed(2)}
              </div>
              <div className="flex items-center text-gray-700 text-sm">
                <Percent className="w-4 h-4 mr-1 text-[#D9A566]" />
                {beer.abv}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeerListSection;
