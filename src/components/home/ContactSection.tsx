import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterError("");
    setNewsletterStatus("");

    if (!newsletterEmail.trim()) {
      setNewsletterError("Please enter a valid email.");
      return;
    }

    try {
      setIsNewsletterSubmitting(true);
      const response = await apiRequest("POST", "/api/newsletter", { email: newsletterEmail.trim() });
      const result = await response.json();
      if (result?.status === "already") {
        setNewsletterStatus("You're already on the list. Thanks for staying with us!");
      } else {
        setNewsletterStatus("Thanks for joining! We’ll be in touch with updates.");
      }
      setNewsletterEmail("");
    } catch (error) {
      console.error("Failed to submit newsletter signup:", error);
      setNewsletterError("There was a problem. Please try again later.");
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "andreaw@CascadiaTapHouse.onmicrosoft.com",
      href: "mailto:andreaw@CascadiaTapHouse.onmicrosoft.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "624 S Augustin Loop\nEast Wenatchee, WA 98802",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/cascadia.taphouse?igsh=MXdodzZnOXYxY2IzOQ==",
    },
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionTitle title="Contact Us" />
          
          <motion.p 
            className="text-lg text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Have questions? Want to collaborate? Just want to say hi?<br />
            We'd love to hear from you!
          </motion.p>
          
          <div className="bg-[#F5F5F0] p-6 rounded-lg shadow-md">
            <div className="grid gap-10 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-montserrat font-semibold text-xl mb-6">Get In Touch</h3>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div className="bg-[#D9A566] w-10 h-10 rounded-full flex items-center justify-center text-white mr-4">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <a
                          href={item.href}
                          className="text-[#1E3A5F] hover:underline"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {item.value}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-8">
                  <div>
                    <h3 className="font-montserrat font-semibold text-xl mb-2">Join our newsletter</h3>
                    <p className="text-sm text-slate-600 mb-4">Get updates on events and specials.</p>
                    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleNewsletterSubmit}>
                      <input
                        type="email"
                        name="email"
                        value={newsletterEmail}
                        onChange={(event) => setNewsletterEmail(event.target.value)}
                        placeholder="Your email"
                        className="w-full flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A566]"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isNewsletterSubmitting}
                        className="rounded-md bg-[#1E3A5F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2C5F2D]"
                      >
                        {isNewsletterSubmitting ? "Sending..." : "Submit"}
                      </button>
                    </form>
                    {newsletterError && <p className="mt-2 text-xs text-red-500">{newsletterError}</p>}
                    {newsletterStatus && <p className="mt-2 text-xs text-emerald-600">{newsletterStatus}</p>}
                  </div>

                  <div>
                    <h4 className="font-montserrat font-medium mb-4">Follow us on social media</h4>
                    <div className="flex space-x-4">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          className="bg-[#2C5F2D] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D9A566] transition-colors"
                          aria-label={social.name}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
