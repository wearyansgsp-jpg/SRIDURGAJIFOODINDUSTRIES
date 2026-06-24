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

export const Route = createFileRoute("/")({
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
