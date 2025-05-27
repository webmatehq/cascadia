import { motion } from "framer-motion";
// trigger
export default function ConstructionBanner() {
  return (
    <motion.div 
      className="bg-[#D9A566] text-white text-center py-2 px-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p className="font-montserrat font-semibold">
        🚧 Pardon Our Dust, We're Crafting Something Special. Opening Summer 2025! 🚧
      </p>
    </motion.div>
  );
}
