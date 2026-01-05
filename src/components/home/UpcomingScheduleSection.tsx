const WEEK = "Week of 1/5 to 1/11";

const schedule = [
  {
    title: "Mon - Thursday",
    description: [{ text: "Raffle tickets for Mariners game" }],
  },
  {
    title: "Thursday, 1st",
    description: [{ text: "First Responders and healthcare Appreciation Day 5pm-8pm" }],
  },
  {
    title: "Friday, 9th",
    description: [
      { text: "Live music with Hans Joseph 8pm" },
      { text: "@hansjoseph_" },
      { text: "Pizza pop up with @valleypizzajoint" },
    ],
  },
  {
    title: "Saturday, 10th",
    description: [{ text: "NFL Playoffs" }],
  },
  {
    title: "Sunday, 4th",
    description: [{ text: "NFL Playoffs" }],
  },
];

const UpcomingScheduleSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto rounded-3xl p-10 text-center shadow-xl bg-[radial-gradient(circle_at_top,_#b588ff,_#66d2ff_50%,_#fef3c7)] text-slate-900">
        <p className="text-sm uppercase tracking-[0.5em] font-semibold mb-4">UPCOMING</p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-3">Schedule</h2>
        <p className="text-lg font-medium text-slate-800 mb-10">{WEEK}</p>

        <div className="grid gap-6 md:grid-cols-2">
          {schedule.map((day) => (
            <div
              key={day.title}
              className="rounded-2xl border border-black/20 bg-white/90 text-left shadow-lg overflow-hidden"
            >
              <div className="bg-black text-white px-5 py-3 text-lg font-semibold tracking-wide">
                {day.title}
              </div>
              <div className="p-5 space-y-2">
                {day.description.map((line, index) => (
                  <p key={`${day.title}-${index}`} className="text-base leading-relaxed">
                    {line.icon}
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm font-medium tracking-wide">
          624 S Augustin Loop, East Wenatchee, WA <br />
          <span className="text-xs uppercase">Trades District</span>
        </p>
      </div>
    </section>
  );
};

export default UpcomingScheduleSection;
