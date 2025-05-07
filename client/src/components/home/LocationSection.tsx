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
                <strong>Cascadia Tap House</strong><br />
                Building A 624, Trades District<br />
                East Wenatchee, WA
              </p>
              
              <div className="h-64 bg-gray-200 rounded-md overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')" 
                  }}
                ></div>
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
              <p className="mb-6">Stay tuned for our grand opening date. Once open, you can expect:</p>
              
              <div className="space-y-2">
                {businessHours.map((item, index) => (
                  <motion.div 
                    key={item.day}
                    className={`flex justify-between ${
                      index < businessHours.length - 1 ? "border-b border-gray-200 pb-2" : "pb-2"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
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
