export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://pcb-delta.vercel.app/sitemap.xml",
    host: "https://pcb-delta.vercel.app",
  };
}
