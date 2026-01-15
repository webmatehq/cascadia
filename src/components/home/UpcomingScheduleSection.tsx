import { useContent } from "@/hooks/useContent";

const UpcomingScheduleSection = () => {
  const { data } = useContent();
  const scheduleWeek = data?.upcomingSchedule;
  const weekLabel = scheduleWeek?.weekLabel;
  const scheduleItems = scheduleWeek?.items ?? [];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto rounded-3xl p-10 text-center shadow-xl bg-[radial-gradient(circle_at_top,_#b588ff,_#66d2ff_50%,_#fef3c7)] text-slate-900">
        <p className="text-sm uppercase tracking-[0.5em] font-semibold mb-4">UPCOMING</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-3">Schedule</h2>
        <p className="text-lg font-medium text-slate-800 mb-10">
          {weekLabel ?? "No se cargo la info"}
        </p>

        {scheduleItems.length === 0 ? (
          <p className="text-base text-slate-700">No se cargo la info</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {scheduleItems.map((day) => (
              <div
                key={day.id}
                className="rounded-2xl border border-black/20 bg-white/90 text-left shadow-lg overflow-hidden"
              >
                <div className="bg-black text-white px-5 py-3 text-lg font-semibold tracking-wide">
                  {day.title}
                </div>
                <div className="p-5 space-y-2">
                  {day.lines.map((line, index) => (
                    <p key={`${day.id}-${index}`} className="text-base leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-sm font-medium tracking-wide">
          624 S Augustin Loop, East Wenatchee, WA <br />
          <span className="text-xs uppercase">Trades District</span>
        </p>
      </div>
    </section>
  );
};

export default UpcomingScheduleSection;
