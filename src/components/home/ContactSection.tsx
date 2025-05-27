import { Container } from "@/components/ui/Container";
import SectionTitle from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "andreaw@CascadiaTapHouse.onmicrosoft.com",
      href: "mailto:andreaw@CascadiaTapHouse.onmicrosoft.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "208-904-8512",
      href: "tel:2089048512",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "2301–2399 Seventh St SE\nEast Wenatchee, WA",
      href: "#",
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
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
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-[#F5F5F0] p-6 rounded-lg shadow-md h-full">
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
                          style={{ whiteSpace: 'pre-line' }}
                        >
                          {item.value}
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h4 className="font-montserrat font-medium mb-4">Follow us on social media</h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a 
                        key={social.name}
                        href={social.href} 
                        className="bg-[#2C5F2D] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#D9A566] transition-colors"
                        aria-label={social.name}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-[#F5F5F0] p-6 rounded-lg shadow-md">
                <h3 className="font-montserrat font-semibold text-xl mb-6">Send Us a Message</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A566]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your email" 
                              type="email" 
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A566]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Subject" 
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A566]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message" 
                              rows={4} 
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D9A566]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="mt-6 bg-[#1E3A5F] hover:bg-[#2C5F2D] text-white font-montserrat font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
