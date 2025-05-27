import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";

export default function OwnersSection() {
  return (
    <section id="owners" className="py-16 bg-[#F5F5F0]">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionTitle 
            title="Meet Austin & Andrea" 
            subtitle="A Local Dream, Powered by Passion"
          />
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div 
                className="rounded-lg shadow-md w-full h-[400px] bg-cover bg-center"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')" 
                }}
              ></div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg mb-6">
                As longtime locals and lovers of the outdoors (and a great beer or glass of wine), we wanted to build something that reflects the heart of the Wenatchee Valley—laid back, full of character, and rooted in community.
              </p>
              <p className="text-lg">
                Our vision is to create a space where friends can gather, visitors can experience local flavors, and everyone feels welcome. We're passionate about supporting small producers and bringing the best of the Pacific Northwest together under one roof.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
