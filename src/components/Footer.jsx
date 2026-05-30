import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span
                aria-label="GeetaDeep logo"
                className="h-14 w-12 shrink-0 bg-primary"
                style={{
                  WebkitMaskImage: "url(/GD_logo.png)",
                  maskImage: "url(/GD_logo.png)",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskPosition: "left center",
                  maskPosition: "left center",
                }}
              />
              <span className="text-base">Geeta<span className="text-base">Deep</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Professional PCB manufacturing services. From prototype to production, we deliver quality boards on time.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/quote" className="hover:text-primary transition-colors">PCB Fabrication</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">PCB Assembly</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Component Procurement</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/quote" className="hover:text-primary transition-colors">Get a Quote</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} GeetaDeep. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
