import { FilmIcon, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2 text-primary-foreground">
                <FilmIcon size={20} />
              </div>
              <h2 className="text-xl font-bold">Movie App</h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Discover popular, upcoming, and top-rated movies from around the
              world. Search, browse, and enjoy your favorite films in one place.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold">
              Contact Information
            </h3>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail size={17} />
                <span>support@movieapp.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={17} />
                <span>+976 9911 9911</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={17} />
                <span>Ulaanbaatar, Mongolia</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold">Follow Us</h3>

            <div className="flex gap-3">
              <a
                href="/"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition hover:-translate-y-1 hover:bg-accent"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="/"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition hover:-translate-y-1 hover:bg-accent"
              >
                <FaInstagram size={19} />
              </a>

              <a
                href="/"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition hover:-translate-y-1 hover:bg-accent"
              >
                <FaTiktok size={18} />
              </a>

              <a
                href="mailto:support@movieapp.com"
                aria-label="Email"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition hover:-translate-y-1 hover:bg-accent"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Movie App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
