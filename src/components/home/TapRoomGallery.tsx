import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import OurSpace1 from "../../assets/our_space_1.jpeg";
import OurSpace2 from "../../assets/our_space_2.jpeg";
import OurSpace3 from "../../assets/our_space_3.jpeg";
import OurSpace4 from "../../assets/our_space_4.jpeg";
interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
  delay: number;
}

function GalleryImage({ src, alt, className, delay }: GalleryImageProps) {
  return (
    <motion.div 
      className={`overflow-hidden rounded-lg ${className || "h-64"}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div 
        className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
        style={{ backgroundImage: `url(${src})` }}
        title={alt}
      ></div>
    </motion.div>
  );
}

export default function TapRoomGallery() {
  const galleryImages = [
    { src: OurSpace1, alt: "Our space 1" },
    { src: OurSpace2, alt: "Our space 2" },
    { src: OurSpace3, alt: "Our space 3", className: "h-64 lg:col-span-2" },
    { src: OurSpace4, alt: "Our space 4" },
  ];

  return (
    <section className="py-16 bg-white">
      <Container>
        <SectionTitle 
          title="Our Space" 
        />
        
        <motion.p 
          className="text-lg max-w-2xl mx-auto text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          We're creating a welcoming atmosphere that celebrates the essence of Cascadia. Here's a preview of what you can expect when we open our doors this summer.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <GalleryImage
              key={index}
              src={image.src}
              alt={image.alt}
              className={image.className}
              delay={0.1 * index}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="inline-block bg-[#D9A566]/20 border border-[#D9A566] text-[#333333] p-4 rounded-md">
            <p className="font-montserrat font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
              </svg>
              Currently under construction
            </p>
            <p>Follow us on social media for progress updates and sneak peeks!</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
