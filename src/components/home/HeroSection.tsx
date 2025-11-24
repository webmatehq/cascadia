import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center filter brightness-75"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1559526642-c3f001ea68ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          }}
        ></div>
      </div>

      <Container className="relative z-10 text-white">
        <motion.div
          className="max-w-2xl backdrop-blur-sm bg-[#333333]/40 p-8 rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="font-montserrat font-bold text-4xl md:text-5xl lg:text-6xl mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Cascadia Tap House
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-light mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Craft Beer | Fine Wine | Cascadia Vibes
          </motion.p>

          <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your future go-to gathering spot in the Wenatchee Valley! We're
            bringing together the best of the Pacific Northwest's breweries and
            wineries under one roof—with a laid-back atmosphere, a dog-friendly
            outdoor space, and plenty of local love.
          </motion.p>

          {/* <motion.div
            className="bg-[#D9A566]/90 p-4 rounded-md inline-block w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="font-montserrat font-semibold text-lg w-full">
              Opening Friday, September 5, 2025!
            </p>
            <p>
          
            </p>
          </motion.div> */}
        </motion.div>
      </Container>
    </section>
  );
}
