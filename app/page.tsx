"use client";
import { Hero } from "@/ui/hero";
import { Protocols } from "@/ui/protocols";

export default function Home() {
  return (
    <div>
      <div className="mt-3 md:mt-14">
        <Hero />
      </div>
      <div className="mt-24 flex items-center justify-between">
        <Protocols />
      </div>
    </div>
  );
}
