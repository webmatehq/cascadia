import { Calendar, MapPin, Clock, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { useContent } from "@/hooks/useContent";
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
  const { data } = useContent();
  const events = data?.events ?? [];
  const eventSlides = events.map((eventItem) => ({
    id: eventItem.id,
    title: eventItem.title,
    subtitle: eventItem.tagline || eventItem.description,
    date: eventItem.date,
    time: eventItem.time,
    location: eventItem.location,
    bullets: eventItem.highlights,
    background: eventItem.backgroundColor ?? "#F5F5F5",
    border: eventItem.borderColor ?? "#E5E5E5",
    textColor: eventItem.textColor ?? "#1F2937",
  }));

  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      carouselApi?.scrollNext();
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [carouselApi]);

  const renderBullet = (bullet: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = [...bullet.matchAll(urlRegex)];

    if (matches.length === 0) return bullet;

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      const start = match.index ?? 0;
      const url = match[0];

      if (start > lastIndex) {
        parts.push(bullet.slice(lastIndex, start));
      }

      parts.push(
        <a
          key={`bullet-url-${idx}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#D9A566] break-all"
        >
          {url}
        </a>
      );

      lastIndex = start + url.length;
    });

    if (lastIndex < bullet.length) {
      parts.push(bullet.slice(lastIndex));
    }

    return parts;
  };

  return (
    <section id="events" className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Events</h2>
        <div className="w-24 h-1 bg-[#D9A566] mx-auto mb-6 rounded" />

        <p className="text-gray-600 mb-8">Don’t miss our upcoming happenings at Cascadia.</p>

        <div className="relative">
          {eventSlides.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-sm text-slate-500">
              No events yet.
            </div>
          ) : (
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
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-[#D9A566]" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#D9A566]" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {event.bullets.length > 0 && (
                          <ul className="space-y-2 text-sm">
                            {event.bullets.map((bullet, index) => (
                              <li key={`${event.id}-highlight-${index}`} className="flex items-start gap-2">
                                <Utensils className="w-4 h-4 mt-1 text-[#D9A566]" />
                                <span>{renderBullet(bullet)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-none bg-white/80 hover:bg-white" />
              <CarouselNext className="border-none bg-white/80 hover:bg-white" />
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
