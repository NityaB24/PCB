import AboutPage from "../../src/pages/About";

export const metadata = {
  title: "About GeetaDeep",
  description:
    "Learn about GeetaDeep, a trusted PCB manufacturer in India offering fabrication, assembly, and component procurement with strict quality control.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About GeetaDeep",
    description:
      "Learn about GeetaDeep, a trusted PCB manufacturer in India offering fabrication, assembly, and component procurement with strict quality control.",
    url: "/about",
  },
  twitter: {
    title: "About GeetaDeep",
    description:
      "Learn about GeetaDeep, a trusted PCB manufacturer in India offering fabrication, assembly, and component procurement with strict quality control.",
  },
};

export default function Page() {
  return <AboutPage />;
}
