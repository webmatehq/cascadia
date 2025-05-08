import ConstructionBanner from "@/components/home/ConstructionBanner";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import OwnersSection from "@/components/home/OwnersSection";
import TapRoomGallery from "@/components/home/TapRoomGallery";
import LocationSection from "@/components/home/LocationSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  // Scroll to the section if URL has hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConstructionBanner />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <OwnersSection />
        <TapRoomGallery />
        <LocationSection />
        <ContactSection />
      </main>
      <Footer />
    </motion.div>
  );
}
