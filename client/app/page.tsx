import Image from "next/image";
import { Appbar } from "./components/Appbar";
import { Hero } from "./components/Hero";
import { HeroVideo } from "./components/HeroVideo";

export default function Home() {
  return (
    <div className="">
     <Appbar/>
     <Hero/>
     <HeroVideo/>
    </div>
  );
}
