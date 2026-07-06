import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { DatabaseLogos } from "@/components/landing/DatabaseLogos";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div id="databases">
          <DatabaseLogos />
        </div>
        <div id="features">
          <Features />
        </div>
      </main>
      <Footer />
    </>
  );
}
