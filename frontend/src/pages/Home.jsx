import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import DoctorsSection from '../components/DoctorsSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <DoctorsSection />
      <ContactForm />
      <Footer />
    </>
  );
}
