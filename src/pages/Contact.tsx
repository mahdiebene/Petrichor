import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Petrichor</title>
        <meta
          name="description"
          content="Get in touch with the Petrichor team for inquiries about our geological specimens, custom requests, or authentication services."
        />
        <link rel="canonical" href="https://petrichor.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
                Get in Touch
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4">
                Contact Us
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Have questions about a specimen? Need authentication services?
                We're here to help.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-serif text-2xl font-medium mb-6">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        className="mt-1 bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="mt-1 bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      required
                      className="mt-1 bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      required
                      className="mt-1 bg-secondary border-border resize-none"
                    />
                  </div>
                  <Button type="submit" className="btn-premium">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-serif text-2xl font-medium mb-6">
                  Contact Information
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-sm">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Visit Our Gallery</h3>
                      <p className="text-muted-foreground">
                        123 Mineral Lane, Suite 400
                        <br />
                        Boulder, Colorado 80302
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-sm">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email Us</h3>
                      <p className="text-muted-foreground">
                        hello@petrichor.com
                        <br />
                        support@petrichor.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-sm">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Call Us</h3>
                      <p className="text-muted-foreground">
                        +1 (555) 123-4567
                        <br />
                        Mon - Fri, 9am - 5pm MST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-card rounded-sm border border-border">
                  <h3 className="font-serif text-lg font-medium mb-4">
                    By Appointment
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our gallery and private viewing rooms are available by
                    appointment. Schedule a consultation to examine specimens in
                    person or discuss custom acquisition requests.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
