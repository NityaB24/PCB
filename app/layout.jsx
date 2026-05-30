import "./globals.css";
import Script from "next/script";

const SITE_URL = "https://pcb-delta.vercel.app";
const SITE_NAME = "GeetaDeep PCB Manufacturing";
const DEFAULT_TITLE = "PCB Manufacturing in India | GeetaDeep";
const DEFAULT_DESCRIPTION =
  "Trusted PCB manufacturer in India for fabrication, assembly, and component procurement. Fast quotes, quality testing, and quick-turn prototypes.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | GeetaDeep",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "PCB manufacturer India",
    "PCB fabrication India",
    "PCB assembly India",
    "PCB prototype India",
    "circuit board manufacturing",
    "quick turn PCB",
    "Gerber quote",
    "SMT assembly",
    "through-hole assembly",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/GD_logo.png",
        width: 512,
        height: 512,
        alt: "GeetaDeep PCB Manufacturing logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/GD_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/GD_logo.png`,
    description: DEFAULT_DESCRIPTION,
    areaServed: "India",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = localStorage.getItem('theme');
              const isDark = theme === 'dark' || 
                (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
              document.documentElement.classList.toggle('dark', isDark);
              document.documentElement.classList.toggle('light', !isDark);
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/GD_logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
