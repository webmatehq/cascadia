import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  delay: number;
}

function FeatureCard({ title, description, imageSrc, delay }: FeatureCardProps) {
  return (
    <motion.div 
      className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div 
        className="w-full h-64 bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageSrc})` }}
      ></div>
      <div className="p-6">
        <h4 className="font-montserrat font-semibold text-xl mb-3">{title}</h4>
        <p>{description}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const features = [
    {
      title: "Local Craft Beer",
      description: "Featuring rotating taps from the best Pacific Northwest breweries, with a focus on local craftsmanship and unique flavors.",
      imageSrc: "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Fine Wines",
      description: "Carefully selected wines from Washington and Oregon vineyards, showcasing the region's exceptional winemaking tradition.",
      imageSrc: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Community Space",
      description: "A welcoming environment for friends to gather, including a dog-friendly outdoor area to enjoy the Wenatchee Valley weather.",
      imageSrc: "https://images.unsplash.com/photo-1555658636-6e4a36218be7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <SectionTitle 
            title="About Us" 
            subtitle="Built for the Community. Inspired by the Northwest."
          />
          
          <motion.p 
            className="text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Cascadia Tap House is a dream born from our love for local beer, wine, and community vibes. We're here to create a space that celebrates the craft, the region, and the people—where good drinks and good company always come together. We focus on supporting small producers, rotating local taps, and creating a welcoming, inclusive environment for all.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              delay={0.2 * index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
