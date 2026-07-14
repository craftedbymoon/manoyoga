import { Hero } from "@/sections/home/Hero";
import { TrustedBy } from "@/sections/home/TrustedBy";
import { About } from "@/sections/home/About";
import { Benefits } from "@/sections/home/Benefits";
import { Services } from "@/sections/home/Services";
import { WhyChoose } from "@/sections/home/WhyChoose";
import { Gallery } from "@/sections/home/Gallery";
import { Testimonials } from "@/sections/home/Testimonials";
import { FAQ } from "@/sections/home/FAQ";
import { LatestBlogs } from "@/sections/home/LatestBlogs";
import { Newsletter } from "@/sections/home/Newsletter";
import { ContactCTA } from "@/sections/home/ContactCTA";
import { Location } from "@/sections/home/Location";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <About />
      <Benefits />
      <Services />
      <WhyChoose />
      <Gallery />
      <Testimonials />
      <FAQ />
      <LatestBlogs />
      <Newsletter />
      <ContactCTA />
      <Location />
    </>
  );
}
