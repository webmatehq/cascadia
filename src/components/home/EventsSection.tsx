import { Calendar, MapPin, Clock, Award, Utensils } from "lucide-react";

const EventsSection = () => {
  return (
    <section id="events" className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Events</h2>
        <div className="w-24 h-1 bg-[#D9A566] mx-auto mb-6 rounded" />

        <p className="text-gray-600 mb-8">
          We’re planning some exciting events to bring our community together.
        </p>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-left shadow-md"  style={{background:"#807A75"}}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Howl-O-Ween Dog Costume Red Carpet Fashion Show 🎃🐶
          </h3>
          <div className="flex items-center text-white mb-2">
            <Calendar className="w-5 h-5 mr-2 text-[#D9A566]" />
            <span>Saturday, October 25th</span>
          </div>
          <div className="flex items-center text-white mb-2">
            <Clock className="w-5 h-5 mr-2 text-[#D9A566]" />
            <span>Noon – 4 PM</span>
          </div>
          <div className="flex items-center text-white mb-4">
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

          <p className="text-sm text-white italic">
            More details to follow! Stay tuned on our social media.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
