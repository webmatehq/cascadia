import { Calendar, MapPin, Clock, Leaf, Gift, Beer, Utensils } from "lucide-react";
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
      id: "happy-hour-mon-wed",
      title: "Happy Hour",
      subtitle: "Mon – Wed · Week of Dec 8–14",
      date: "Mon – Wed, Dec 8–10",
      time: "2:00 – 5:00 PM",
      location: "624 S Augustin Loop, East Wenatchee, WA (Trades District)",
      price: "Happy Hour specials",
      bullets: ["Happy Hour from 2pm to 5pm", "Easy midweek unwind with friends"],
      background: "#F8FAF8",
      border: "#CBD5BF",
      textColor: "#123524",
      icon: <Beer className="w-4 h-4 text-[#4E8A4C] mr-2" />,
    },
    {
      id: "first-responders-1211",
      title: "First Responders & Health Care Appreciation",
      subtitle: "Thank you for keeping our community safe and healthy",
      date: "Thursday, Dec 11",
      time: "5:00 – 8:00 PM",
      location: "Cascadia Tap House · Trades District",
      price: "$2 OFF 16oz pours all evening",
      bullets: [
        "First Responders & Health care appreciation day! 5pm to 8pm",
        "Bring your crew and enjoy a night on us",
      ],
      background: "#FFF4EC",
      border: "#F7C7A3",
      textColor: "#8A3B12",
      icon: <Gift className="w-4 h-4 text-[#C05621] mr-2" />,
    },
    {
      id: "friday-happy-hour-1212",
      title: "Friday Late Night Happy Hour",
      subtitle: "Kick off the weekend with extra savings",
      date: "Friday, Dec 12",
      time: "8:00 – 10:00 PM",
      location: "Cascadia Tap House · Trades District",
      price: "$2 OFF 16oz draft drinks",
      bullets: ["Happy Hour from 8pm to 10pm", "$2 off 16oz draft drinks"],
      background: "#EFF0FC",
      border: "#C3C7FF",
      textColor: "#171738",
      icon: <Beer className="w-4 h-4 text-[#4338CA] mr-2" />,
    },
    {
      id: "live-music-1213",
      title: "Live Music with Alvin Little",
      subtitle: "@alvinbigsaxdaddymusic",
      date: "Saturday, Dec 13",
      time: "Set time announced on socials",
      location: "Cascadia Tap House · Trades District",
      price: "No cover · great vibes",
      bullets: ["Live sax and soul grooves all evening", "Follow along for exact set time"],
      background: "#F0F7FF",
      border: "#B5D4FF",
      textColor: "#0B3D91",
      icon: <Leaf className="w-4 h-4 text-[#1D4ED8] mr-2" />,
    },
    {
      id: "dog-jersey-sunday-1214",
      title: "Dog Jersey Sunday",
      subtitle: "Bring your pup in their favorite jersey",
      date: "Sunday, Dec 14",
      time: "All day",
      location: "624 S Augustin Loop, East Wenatchee, WA (Trades District)",
      price: "Pups in jerseys get all the love",
      bullets: ["Dog Jersey Sunday!", "Patio-friendly, water bowls ready"],
      background: "#FFF0F5",
      border: "#F7C1D9",
      textColor: "#7A1E48",
      icon: <Gift className="w-4 h-4 text-[#DB2777] mr-2" />,
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
