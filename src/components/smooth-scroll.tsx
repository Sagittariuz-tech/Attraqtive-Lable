"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        prevent: node => !!node.closest('[role="dialog"], [data-scroll-locked]'),
      });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      const syncDialog = () => {
        if (document.body.hasAttribute("data-scroll-locked")) lenis.stop();
        else lenis.start();
      };
      const observer = new MutationObserver(syncDialog);
      observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
      syncDialog();
      return () => {
        observer.disconnect();
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);
  return null;
}
