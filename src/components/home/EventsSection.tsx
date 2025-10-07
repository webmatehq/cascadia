import { Calendar, MapPin, Clock, Award, Utensils, Gift, Wine, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const EventsSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      carouselApi?.scrollNext();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [carouselApi]);

  return (
    <section id="events" className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Events</h2>
        <div className="w-24 h-1 bg-[#D9A566] mx-auto mb-6 rounded" />

        <p className="text-gray-600 mb-8">Don’t miss our upcoming happenings at Cascadia.</p>

        <div className="relative">
          <Carousel className="px-8" opts={{ loop: true, draggable: true }} setApi={(api) => setCarouselApi(api)}>
            <CarouselContent className="cursor-grab active:cursor-grabbing">
              {/* Slide 1: Connecting Hearts */}
              <CarouselItem>
                <div className="rounded-xl shadow-md overflow-hidden border min-h-[360px] md:min-h-[420px]" style={{ background: "#F7EFE4", borderColor: "#E6D6BF" }}>
                  <div className="p-6 md:p-8 text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#6B1B1B" }}>
                      Connecting Hearts — Ages 55+ Singles Night Out
                    </h3>
                    <p className="italic mb-4" style={{ color: "#8C3A3A" }}>(a fun alternative to dating apps)</p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4" style={{ color: "#6B1B1B" }}>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-[#D9A566]" />
                        <span>Friday, October 10, 2025</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-[#D9A566]" />
                        <span>624 S Augustin Loop, East Wenatchee</span>
                      </div>
                    </div>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-800">
                      <li className="flex items-center"><Wine className="w-4 h-4 mr-2 text-[#D9A566]" />Local wines, craft beers & cider</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#D9A566]" />Sangria & margaritas</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#D9A566]" />Charcuterie boxes & light snacks</li>
                      <li className="flex items-center"><Gift className="w-4 h-4 mr-2 text-[#D9A566]" />Gift basket raffle</li>
                      <li className="flex items-center md:col-span-2"><Music className="w-4 h-4 mr-2 text-[#D9A566]" />Fun, laughter & no-pressure vibes</li>
                    </ul>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 2: Howl-O-Ween */}
              <CarouselItem>
                <div className="rounded-xl shadow-md overflow-hidden border min-h-[360px] md:min-h-[420px]" style={{ background: "#807A75" }}>
                  <div className="p-6 md:p-8 text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white">
                      Howl-O-Ween Dog Costume Red Carpet Fashion Show 🎃🐶
                    </h3>
                    <div className="flex items-center text-white mb-2 justify-center">
                      <Calendar className="w-5 h-5 mr-2 text-[#D9A566]" />
                      <span>Saturday, October 25th</span>
                    </div>
                    <div className="flex items-center text-white mb-2 justify-center">
                      <Clock className="w-5 h-5 mr-2 text-[#D9A566]" />
                      <span>Noon – 4 PM</span>
                    </div>
                    <div className="flex items-center text-white mb-4 justify-center">
                      <MapPin className="w-5 h-5 mr-2 text-[#D9A566]" />
                      <span>Cascadia Taphouse, East Wenatchee, Washington</span>
                    </div>

                    <ul className="list-disc list-inside text-white space-y-2 mb-4">
                      <li>Games and a dog treat bar 🦴</li>
                      <li>
                        <Award className="w-4 h-4 inline mr-1 text-[#D9A566]" />
                        Prizes for the best Howl-O-Ween Dog Costume
                      </li>
                      <li>
                        <Utensils className="w-4 h-4 inline mr-1 text-[#D9A566]" />
                        Sammies and Hammies food truck with smash burgers & pup patties
                      </li>
                      <li>Dog-friendly event 🐕</li>
                    </ul>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="border-none bg-white/80 hover:bg-white" />
            <CarouselNext className="border-none bg-white/80 hover:bg-white" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
