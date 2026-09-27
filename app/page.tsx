import { MotionConfig } from "framer-motion";
import Cta from "./_components/Cta";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import GetStarted from "./_components/GetStarted";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Pricing from "./_components/Pricing";
import Share from "./_components/Share";
import Track from "./_components/Track";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="mx-auto">
        <Header />
        <Hero />
        <GetStarted />
        <Share />
        <Track />
        <Features />
        <Pricing />
        <Cta />
        <Footer />
      </main>
    </MotionConfig>
  );
}
