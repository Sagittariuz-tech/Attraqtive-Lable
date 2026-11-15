"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function EditorialMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-copy] > *", { y: 22, opacity: 0, duration: 0.85, ease: "power3.out", stagger: 0.12 });
      gsap.from("[data-hero-image]", { scale: 1.04, duration: 1.7, ease: "power2.out" });
      for (const section of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
        gsap.from(section, { y: 22, opacity: 0.5, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 90%", once: true } });
      }
    });
    return () => media.revert();
  }, []);
  return null;
}
