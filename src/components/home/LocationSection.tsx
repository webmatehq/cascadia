import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

interface BusinessHour {
  day: string;
  hours: string;
}

export default function LocationSection() {
  const businessHours: BusinessHour[] = [
    { day: "Monday", hours: "11am – 8pm" },
    { day: "Tuesday", hours: "11am – 8pm" },
    { day: "Wednesday", hours: "11am – 8pm" },
    { day: "Thursday", hours: "11am – 8pm" },
    { day: "Friday", hours: "11am – 12am" },
    { day: "Saturday", hours: "11am – 12am" },
    { day: "Sunday", hours: "11am – 8pm" },
  ];

  return (
    <section id="location" className="py-16 bg-[#F5F5F0]">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Location & Hours" />

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-1/2 bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-montserrat font-semibold text-xl mb-4">
                <MapPin className="inline-block text-[#D9A566] mr-2" />
                Find Us
              </h3>

              <p className="mb-4">
                <strong>Cascadia Tap House</strong>
                <br />
                624 S Augustin Loop,
                <br />
                East Wenatchee, WA 98802
              </p>

              <div className="h-64 bg-gray-200 rounded-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.2613671331904!2d-120.2583457!3d47.3991334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x549bcdcf0dd03dcb%3A0x6f637d5dc253be89!2s624%20S%20Augustin%20Loop%2C%20East%20Wenatchee%2C%20WA%2098802%2C%20EE.%20UU.!5e0!3m2!1ses!2ses!4v1719167344590!5m2!1ses!2ses"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="font-montserrat font-semibold text-xl mb-4">
                <Clock className="inline-block text-[#D9A566] mr-2" />
                Hours
              </h3>

              <p className="mb-4 font-semibold">Opening Soon!</p>
              <p className="mb-6">
                Stay tuned for our grand opening date. Once open, you can
                expect:
              </p>

              <div className="space-y-2">
                {businessHours.map((item, index) => (
                  <motion.div
                    key={item.day}
                    className={`flex justify-between ${
                      index < businessHours.length - 1
                        ? "border-b border-gray-200 pb-2"
                        : "pb-2"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  >
                    <span className="font-medium">{item.day}</span>
                    <span>{item.hours}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
