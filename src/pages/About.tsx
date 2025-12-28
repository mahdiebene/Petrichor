import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>Our Story | Petrichor - Earth's Geological Treasures</title>
        <meta
          name="description"
          content="Discover the story behind Petrichor - our passion for connecting people with Earth's most extraordinary geological specimens."
        />
        <link rel="canonical" href="https://petrichor.com/about" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="noise-overlay" />
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-20 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">
                Our Story
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-6">
                Guardians of <span className="text-gradient-gold">Earth's</span> Memory
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe that geological specimens are more than objects—they are
                tangible connections to our planet's ancient past, each carrying
                within it millions of years of history.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl font-medium mb-6">
                  A Passion Born in Stone
                </h2>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Petrichor was founded on a simple yet profound belief: that
                    every stone has a story to tell. Our journey began with a
                    single amethyst cathedral discovered in the highlands of
                    Brazil, a specimen so beautiful it sparked a lifelong
                    obsession with Earth's hidden treasures.
                  </p>
                  <p>
                    The name "Petrichor" comes from the Greek words petra (stone)
                    and ichor (the fluid that flows in the veins of the gods). It's
                    the scent of rain on dry earth—that moment when the ancient
                    and the immediate connect.
                  </p>
                  <p>
                    Today, we travel the world seeking the most extraordinary
                    specimens: crystals formed over millions of years,
                    meteorites older than our planet, fossils that preserve
                    creatures from epochs long forgotten. Each piece we acquire
                    is authenticated, documented, and presented with the reverence
                    it deserves.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-elevated">
                  <img
                    src="/about/story-collection.jpg"
                    alt="Curated collection of geological specimens in museum display"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-3xl font-medium mb-4">
                Our Commitment
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every aspect of our practice is guided by these core principles.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Authenticity",
                  description:
                    "Every specimen is verified by certified geologists. We provide complete documentation of origin, age, and composition, ensuring you can trust what you're acquiring.",
                },
                {
                  title: "Ethical Sourcing",
                  description:
                    "We work only with responsible miners and dealers who share our commitment to sustainable practices. No specimen is worth environmental destruction.",
                },
                {
                  title: "Education",
                  description:
                    "We believe in sharing knowledge. Each piece comes with its story—the geological processes that created it, the cultures that revered it, the journey that brought it to you.",
                },
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-background rounded-sm border border-border"
                >
                  <h3 className="font-serif text-xl font-medium mb-4 text-primary">
                    {value.title}
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="font-serif text-3xl font-medium mb-6">
                Begin Your Journey
              </h2>
              <p className="text-muted-foreground mb-8">
                Discover the extraordinary specimens waiting to become part of
                your story.
              </p>
              <Link to="/collections">
                <Button className="btn-premium px-10 py-6">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
