import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AvailableDoctors from '../components/AvailableDoctors';
import Services from '../components/Services';
import DoctorsSection from '../components/DoctorsSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AvailableDoctors />
      <Services />
      <DoctorsSection />
      <ContactForm />
      <Footer />
    </>
  );
}
