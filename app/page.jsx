import IndexPage from "../src/pages/Index";

export const metadata = {
  title: "PCB Manufacturing in India",
  description:
    "Get fast, reliable PCB fabrication and assembly in India. Request custom quotes for prototypes, SMT, and production runs.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PCB Manufacturing in India",
    description:
      "Get fast, reliable PCB fabrication and assembly in India. Request custom quotes for prototypes, SMT, and production runs.",
    url: "/",
  },
  twitter: {
    title: "PCB Manufacturing in India",
    description:
      "Get fast, reliable PCB fabrication and assembly in India. Request custom quotes for prototypes, SMT, and production runs.",
  },
};

export default function Page() {
  return <IndexPage />;
}
