import Hero from '../components/Hero';
import Services from '../components/Services';
import DoctorSection from '../components/DoctorSection';
import Contact from '../components/Contact';
import Reviews from '../components/Reviews';
import About from '../components/About';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <DoctorSection />
      <Reviews />
      <Contact />
    </>
  );
}
