import { motion } from "framer-motion";
// trigger
export default function ConstructionBanner() {
  return (
    <motion.div 
      className="bg-[#D9A566] text-white text-center py-2 px-4 h-12"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* <p className="font-montserrat font-semibold">
        Check out this week's schedule and events below
      </p> */}
    </motion.div>
  );
}
