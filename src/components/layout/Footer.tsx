import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50 shadow-inner-depth">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-gradient-gold">
                Petrichor
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Curating Earth's most extraordinary geological treasures. Each stone carries millions of years of history, waiting to become part of yours.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 shadow-depth-sm hover:shadow-depth-md">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 shadow-depth-sm hover:shadow-depth-md">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-300 shadow-depth-sm hover:shadow-depth-md">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Collections</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/collections?category=crystals" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Crystals & Minerals
                </Link>
              </li>
              <li>
                <Link to="/collections?category=fossils" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Ancient Fossils
                </Link>
              </li>
              <li>
                <Link to="/collections?category=gemstones" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Rare Gemstones
                </Link>
              </li>
              <li>
                <Link to="/collections?category=meteorites" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Meteorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/authenticity" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Authenticity Promise
                </Link>
              </li>
              <li>
                <Link to="/sustainability" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/care" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Petrichor. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Each piece authenticated & certified
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
