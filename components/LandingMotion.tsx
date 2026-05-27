"use client";

import { useEffect } from "react";

const motionSelectors = [
  ".landing-page .grid-ed > .cell",
  ".landing-page .grid-ed > .cell > :where(.mono, .section-title, .lead, .prose)",
  ".landing-page .cta-col",
  ".landing-page .cta-col > *",
  ".landing-page .human-kicker",
  ".landing-page .human-note",
  ".landing-page .human-note > *",
  ".landing-page .human-promises",
  ".landing-page .human-promises > .mono",
  ".landing-page .itemlist li",
  ".landing-page .human-promises li",
  ".landing-page .foot-col",
  ".landing-page footer.foot"
];

export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.querySelector<HTMLElement>(".landing-page");

    if (!root) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(motionSelectors.join(","))
    );

    targets.forEach((target, index) => {
      target.classList.add("motion-target");
      target.style.setProperty("--motion-delay", `${Math.min(index % 4, 3) * 55}ms`);
    });

    root.classList.add("motion-enhanced");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-enhanced");
      targets.forEach((target) => {
        target.classList.remove("motion-target", "is-visible");
        target.style.removeProperty("--motion-delay");
      });
    };
  }, []);

  return null;
}
