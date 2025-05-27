import { AlertCircle } from "lucide-react";
// trigger
const EventsSection = () => {
  return (
    <section id="events" className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Events</h2>
        <div className="w-24 h-1 bg-[#D9A566] mx-auto mb-6 rounded" />

        <p className="text-gray-600 mb-8">
          We’re planning some exciting events to bring our community together.
        </p>

        <div className="bg-yellow-100 text-yellow-900 border border-yellow-300 p-4 rounded-lg inline-flex items-center justify-center gap-3 mx-auto">
          <AlertCircle className="w-5 h-5" />
          <div className="text-sm md:text-base">
            <strong>Under Construction</strong><br />
            Stay tuned for updates and announcements on our social media!
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
