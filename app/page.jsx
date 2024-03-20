import Features from "./_components/Features";
import GetStarted from "./_components/GetStarted";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <main className="mx-auto">
      <Header />
      <Hero />
      <GetStarted />
      <Features />
    </main>
  );
}
