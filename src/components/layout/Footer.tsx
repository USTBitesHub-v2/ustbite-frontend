import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="bg-brand-charcoal text-white mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <Logo variant="light" />
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            Your UST cafeteria, delivered to your floor.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.linkedin.com/company/ust"
              target="_blank"
              rel="noreferrer"
              className="size-9 rounded-md border border-white/20 flex items-center justify-center hover:border-brand-amber hover:text-brand-amber transition-colors"
              aria-label="UST on LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="mailto:itsupport@ust.com"
              className="size-9 rounded-md border border-white/20 flex items-center justify-center hover:border-brand-amber hover:text-brand-amber transition-colors"
              aria-label="Internal IT support email"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <FooterColumn
          title="Quick Links"
          links={[
            { to: "/restaurants", label: "Restaurants" },
            { to: "/orders", label: "My Orders" },
            { to: "/profile", label: "Profile" },
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            { to: "/how-it-works", label: "Cafeteria Hours" },
            { href: "https://intranet.ust.com", label: "UST Intranet" },
            { href: "mailto:itsupport@ust.com", label: "Raise a Ticket" },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { to: "/help", label: "Help Center" },
            { to: "/privacy", label: "Privacy Policy" },
            { to: "/terms", label: "Terms of Service" },
          ]}
        />
      </div>

      <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <p>© 2026 USTBite. All rights reserved.</p>
        <p>Internal platform for UST employees only.</p>
      </div>
    </div>
  </footer>
);

interface FooterLink { to?: string; href?: string; label: string; }

const FooterColumn = ({ title, links }: { title: string; links: FooterLink[] }) => (
  <div>
    <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.label}>
          {l.to ? (
            <Link to={l.to} className="text-sm text-white/70 hover:text-brand-amber transition-colors">
              {l.label}
            </Link>
          ) : (
            <a href={l.href} target="_blank" rel="noreferrer" className="text-sm text-white/70 hover:text-brand-amber transition-colors">
              {l.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);
