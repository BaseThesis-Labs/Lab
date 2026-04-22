import { useEffect, useState } from 'react';
import { BackgroundGrid } from './components/BackgroundGrid';
import { Footer } from './components/Footer';
import { Fund } from './components/Fund';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Marquee } from './components/Marquee';
import { Nav } from './components/Nav';
import { Privacy } from './components/Privacy';
import { Products } from './components/Products';
import { Research } from './components/Research';
import { ScrollProgress } from './components/ScrollProgress';
import { Terms } from './components/Terms';
import { WorkWithUs } from './components/WorkWithUs';

function normalize(path: string) {
  return path.replace(/\/+$/, '').toLowerCase() || '/';
}

export default function App() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (path === '/privacy') return <Privacy />;
  if (path === '/terms') return <Terms />;

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
