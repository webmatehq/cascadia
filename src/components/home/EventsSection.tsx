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
      id: "christmas-wreath",
      title: "Christmas Wreath Workshop",
      subtitle: "Cascadia Tap House × Lilies of the Valley",
      date: "Tuesday, December 3",
      time: "6:00 PM",
      location: "624 S Augustin Loop, East Wenatchee, WA",
      price: "$65 per person",
      bullets: [
        "All art supplies provided",
        "Includes one 16oz drink or glass of wine",
        "Take home your handcrafted wreath",
        "RSVP by 11/29 to andreavwuttke@gmail.com",
      ],
      background: "#F8FAF8",
      border: "#CBD5BF",
      textColor: "#123524",
      icon: <Leaf className="w-4 h-4 text-[#4E8A4C] mr-2" />,
    },
    {
      id: "trades-appreciation",
      title: "Trades Appreciation Day",
      subtitle: "Thank you to the crews that keep Wenatchee building!",
      date: "Every third Thursday of the month",
      time: "5:00 – 8:00 PM",
      location: "Cascadia Tap House · Trades District",
      price: "$2 OFF pours all evening",
      bullets: ["$2 OFF 16oz beer & cider", "$2 OFF wine glasses"],
      background: "#EFF0FC",
      border: "#C3C7FF",
      textColor: "#171738",
      icon: <Beer className="w-4 h-4 text-[#4338CA] mr-2" />,
    },
    {
      id: "thanksgiving-day",
      title: "Thanksgiving Day at Cascadia",
      subtitle: "Football, pie & relaxed sips before dinner",
      date: "Thursday, November 27",
      time: "1:30 PM – 9:00 PM",
      location: "624 S Augustin Loop, East Wenatchee, WA",
      price: "Free slice of pie (while supplies last)",
      bullets: [
        "Happy Hour pricing on 16oz draft beer & cider",
        "Football on every screen",
        "Bring the family for cozy fall vibes",
      ],
      background: "#FFF5E6",
      border: "#F7CBA0",
      textColor: "#7A3416",
      icon: <Gift className="w-4 h-4 text-[#C05621] mr-2" />,
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
