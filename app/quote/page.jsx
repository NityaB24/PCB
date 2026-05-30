import QuoteBuilderPage from "../../src/pages/QuoteBuilder";

export const metadata = {
  title: "Request a PCB Quote",
  description:
    "Submit your PCB requirements for instant quotes in India. Upload Gerber files and receive pricing for fabrication and assembly.",
  alternates: {
    canonical: "/quote",
  },
  openGraph: {
    title: "Request a PCB Quote",
    description:
      "Submit your PCB requirements for instant quotes in India. Upload Gerber files and receive pricing for fabrication and assembly.",
    url: "/quote",
  },
  twitter: {
    title: "Request a PCB Quote",
    description:
      "Submit your PCB requirements for instant quotes in India. Upload Gerber files and receive pricing for fabrication and assembly.",
  },
};

export default function Page() {
  return <QuoteBuilderPage />;
}
