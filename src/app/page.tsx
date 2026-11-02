import { Ambiance } from "@/components/Ambiance";
import { Buffet } from "@/components/Buffet";
import { Cursor } from "@/components/Cursor";
import { DiningTable } from "@/components/DiningTable";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Menu } from "@/components/Menu";
import { Nav } from "@/components/Nav";
import { Reservation } from "@/components/Reservation";
import { Story } from "@/components/Story";
import { Visit } from "@/components/Visit";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <DiningTable />
        <Menu />
        <Story />
        <Ambiance />
        <Buffet />
        <Reservation />
        <Visit />
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
