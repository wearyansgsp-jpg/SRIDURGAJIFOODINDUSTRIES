import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Products } from "@/components/site/Products";
import { Offers } from "@/components/site/Offers";
import { Services, WhyUs } from "@/components/site/Services";
import { Founder } from "@/components/site/Founder";
import { Testimonials } from "@/components/site/Testimonials";
import { Social } from "@/components/site/Social";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";

const TITLE = "Sri Durga Ji Food Industries — Premium Flour Mill (Maida, Suji, Atta, Wheat Bran)";
const DESC =
  "Premium flour manufacturer since 1992. Maida, Suji, Wheat Bran, Atta — bulk supply, dealer pricing and pan-India distribution from Ludhiana, Punjab.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Sri Durga Ji Food Industries",
          url: "/",
          description: DESC,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Industrial Area, Phase II",
            addressLocality: "Ludhiana",
            addressRegion: "Punjab",
            postalCode: "141003",
            addressCountry: "IN",
          },
          telephone: "+91-9988719133",
          sameAs: [
            "https://facebook.com/sridurgajifoods",
            "https://instagram.com/sridurgajifoods",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Products />
        <Offers />
        <Services />
        <Founder />
        <WhyUs />
        <Testimonials />
        <Social />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
