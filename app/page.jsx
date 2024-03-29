import Cta from "./_components/Cta";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import GetStarted from "./_components/GetStarted";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Pricing from "./_components/Pricing";

export default function Home() {
  return (
    <main className="mx-auto">
      <Header />
      <Hero />
      <GetStarted />
      <Features />
      <Pricing />
      <Cta />
      <Footer />
    </main>
  );
}
