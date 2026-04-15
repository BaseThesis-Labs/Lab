import { BackgroundGrid } from './components/BackgroundGrid';
import { Footer } from './components/Footer';
import { Fund } from './components/Fund';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Marquee } from './components/Marquee';
import { Nav } from './components/Nav';
import { Products } from './components/Products';
import { Research } from './components/Research';
import { ScrollProgress } from './components/ScrollProgress';
import { WorkWithUs } from './components/WorkWithUs';

export default function App() {
  return (
    <div className="relative">
      <BackgroundGrid />
      <ScrollProgress />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Manifesto />
        <Products />
        <Research />
        <Fund />
        <WorkWithUs />
      </main>
      <Footer />
    </div>
  );
}
