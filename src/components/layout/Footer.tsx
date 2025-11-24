import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Beer/Wine List", href: "#beerlist" },
  { name: "Location", href: "#location" },
  { name: "Owners", href: "#owners" },
  { name: "Contact", href: "#contact" },
];

const contactInfo = [
  { 
    type: "email", 
    value: "andreaw@CascadiaTapHouse.onmicrosoft.com", 
    href: "mailto:andreaw@CascadiaTapHouse.onmicrosoft.com" 
  },
  { 
    type: "phone", 
    value: "208-904-8512", 
    href: "tel:2089048512" 
  },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <motion.div 
              className="mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-montserrat font-bold text-2xl text-[#D9A566] mb-4">
                CASCADIA TAP HOUSE
              </h3>
              <p className="mt-4 text-[#D9A566] italic">
                "Pardon Our Dust, We're Crafting Something Special."
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="font-montserrat font-medium text-lg mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href} 
                        className="hover:text-[#D9A566] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.querySelector(link.href);
                          if (element) {
                            const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                            window.scrollTo({
                              top: offsetTop,
                              behavior: "smooth",
                            });
                          }
                        }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="font-montserrat font-medium text-lg mb-4">Contact</h4>
                <ul className="space-y-2">
                  {contactInfo.map((info) => (
                    <li key={info.type}>
                      <a 
                        href={info.href} 
                        className="hover:text-[#D9A566] transition-color break-words whitespace-normal"
                      >
                        {info.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="font-montserrat font-medium text-lg mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name}
                      href={social.href} 
                      className="text-white hover:text-[#D9A566] transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="mt-12 pt-4 border-t border-gray-700 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p>&copy; {new Date().getFullYear()} Cascadia Tap House. All rights reserved.</p>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}
