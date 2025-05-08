import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  center?: boolean;
  titleColor?: "blue" | "green" | "amber" | "default";
}

export function SectionTitle({
  title,
  subtitle,
  className,
  center = true,
  titleColor = "blue",
}: SectionTitleProps) {
  const colorClasses = {
    blue: "text-[#1E3A5F]",
    green: "text-[#2C5F2D]", 
    amber: "text-[#D9A566]",
    default: "text-foreground",
  };

  return (
    <div className={cn(
      "mb-12",
      center && "text-center",
      className
    )}>
      <motion.h2 
        className={cn(
          "font-montserrat font-bold text-3xl md:text-4xl mb-4",
          colorClasses[titleColor]
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      
      <motion.div 
        className="w-24 h-1 bg-[#D9A566] mb-8"
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: 96 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ marginLeft: center ? "auto" : "0", marginRight: center ? "auto" : "0" }}
      />
      
      {subtitle && (
        <motion.h3 
          className="font-montserrat text-2xl text-[#2C5F2D] mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {subtitle}
        </motion.h3>
      )}
    </div>
  );
}

export default SectionTitle;
