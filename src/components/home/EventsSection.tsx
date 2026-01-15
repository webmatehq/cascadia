import { Calendar, MapPin, Clock, Gift, Beer, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const EventsSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const eventSlides = [
    {
      id: "latin-night-jan-16",
      title: "Latin Night",
      subtitle: "DJ Trippy Kitty + performance from @whois_jg",
      date: "Friday, January 16",
      time: "9:00 – 11:00 PM",
      location: "Cascadia Tap House · Trades District",
      price: "21+ to enter",
      bullets: ["DJ Trippy Kitty", "Performance from @whois_jg"],
      background: "#FFF7ED",
      border: "#FDBA74",
      textColor: "#7C2D12",
      icon: <Beer className="w-4 h-4 text-[#C2410C] mr-2" />,
    },
    {
      id: "mariners-baseball-giveaway",
      title: "Mariners Baseball Giveaway",
      subtitle: "Win 2 tickets · Section 118 Row 8",
      date: "Saturday, March 28",
      time: "6:40 PM",
      location: "Cascadia Tap House · Trades District",
      price: "Raffle tickets with every draft",
      bullets: ["Raffle tickets Sunday–Thursday", "Starts January 1", "Winner announced March 7"],
      background: "#F8FAFC",
      border: "#CBD5F5",
      textColor: "#1E3A8A",
      icon: <Gift className="w-4 h-4 text-[#1D4ED8] mr-2" />,
    },
    {
      id: "tap-takeover-jan-27-2026",
      title: "Tap Takeover",
      subtitle: "Old Schoolhouse Brewery",
      date: "Tuesday, January 27, 2026",
      time: "5:00 – 8:00 PM",
      location: "Cascadia Tap House · Trades District",
      price: "Guest brewery night",
      bullets: ["Old Schoolhouse Brewery", "5pm to 8pm"],
      background: "#ECFEFF",
      border: "#A5F3FC",
      textColor: "#0F172A",
      icon: <Beer className="w-4 h-4 text-[#0E7490] mr-2" />,
    },
  ];

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
              {eventSlides.map((event) => (
                <CarouselItem key={event.id}>
                  <div
                    className="rounded-xl shadow-md overflow-hidden border min-h-[360px] md:min-h-[420px]"
                    style={{ background: event.background, borderColor: event.border }}
                  >
                    <div className="p-6 md:p-8 text-left flex flex-col gap-4" style={{ color: event.textColor }}>
                      <div>
                        <p className="uppercase tracking-widest text-xs font-semibold opacity-70 mb-1">
                          Upcoming
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h3>
                        {event.subtitle && <p className="text-base opacity-80">{event.subtitle}</p>}
                      </div>

                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#D9A566]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-[#D9A566]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#D9A566]" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-white/70 px-4 py-2 inline-flex items-center gap-2 text-sm font-semibold text-[#D35400] shadow-sm">
                        <Gift className="w-4 h-4" />
                        {event.price}
                      </div>

                      <ul className="space-y-2 text-sm">
                        {event.bullets.map((bullet, index) => (
                          <li key={`${event.id}-highlight-${index}`} className="flex items-start gap-2">
                            {event.icon ?? <Utensils className="w-4 h-4 mt-1 text-[#D9A566]" />}
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CarouselItem>
              ))}
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
