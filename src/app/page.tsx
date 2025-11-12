import About from '@/sections/About';
import Clients from '@/sections/Clients';
import Contact from '@/sections/Contact';
import Experience from '@/sections/Experience';
import Footer from '@/sections/Footer';
import Hero from '@/sections/Hero';
import Navbar from '@/sections/Navbar';
import Projects from '@/sections/Projects';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_90%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col gap-0 px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        <Hero className="pt-4" />
        <About />
        <Projects />
        <Experience />
        <Clients />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
