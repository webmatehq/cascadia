import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { Beer, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function HappyHourSection() {
  return (
    <section id="happyhour" className="py-16 bg-white px-4">
      <Container className="max-w-5xl">
        <SectionTitle title="Happy Hour" subtitle="Because you deserve it" />

        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center text-gray-800 text-lg font-semibold">
              <Clock className="w-5 h-5 text-[#D9A566] mr-2" />
              Mon – Wed • 2 PM – 5 PM
            </div>
            <div className="flex items-center text-gray-800 text-lg font-semibold">
              <Beer className="w-5 h-5 text-[#D9A566] mr-2" />
              Drafts & Cider
            </div>
            <div className="flex items-center text-gray-800 text-lg font-semibold"> 
              <DollarSign className="w-5 h-5 text-[#D9A566] mr-2" />
              $2 OFF craft drinks & wine
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-3">
            Take $2 OFF craft drinks & wine – it's basically therapy, but cheaper.
          </p>
          <p className="text-gray-700">
            Your boss doesn't need to know you're here.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}


