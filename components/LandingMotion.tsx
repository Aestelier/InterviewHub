"use client";

import { useEffect } from "react";

const motionRules = [
  { selector: ".landing-page .grid-ed > .cell", kind: "lines", stagger: 0 },
  { selector: ".landing-page .grid-ed > .cell > .mono", kind: "kicker", stagger: 35 },
  { selector: ".landing-page .grid-ed > .cell > .section-title", kind: "title", stagger: 50 },
  { selector: ".landing-page .grid-ed > .cell > .lead", kind: "lead", stagger: 45 },
  { selector: ".landing-page .grid-ed > .cell > .prose", kind: "copy", stagger: 40 },
  { selector: ".landing-page .itemlist li", kind: "list", stagger: 45 },
  { selector: ".landing-page .cta-col", kind: "panel", stagger: 120 },
  { selector: ".landing-page .cta-col > *", kind: "copy", stagger: 55 },
  { selector: ".landing-page .human-kicker", kind: "kicker", stagger: 0 },
  { selector: ".landing-page .human-note", kind: "from-left", stagger: 0 },
  { selector: ".landing-page .human-note > *", kind: "copy", stagger: 55 },
  { selector: ".landing-page .human-promises", kind: "from-right", stagger: 80 },
  { selector: ".landing-page .human-promises > .mono", kind: "kicker", stagger: 0 },
  { selector: ".landing-page .human-promises li", kind: "list", stagger: 50 },
  { selector: ".landing-page footer.foot", kind: "footer", stagger: 0 },
  { selector: ".landing-page .foot-col", kind: "copy", stagger: 45 }
] as const;

const motionClasses = Array.from(new Set(motionRules.map((rule) => `motion-${rule.kind}`)));

export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const root = document.querySelector<HTMLElement>(".landing-page");

    if (!root) {
      return;
    }

    const targets: HTMLElement[] = [];
    const seenTargets = new Set<HTMLElement>();

    motionRules.forEach((rule) => {
      const ruleTargets = Array.from(document.querySelectorAll<HTMLElement>(rule.selector));

      ruleTargets.forEach((target, index) => {
        if (seenTargets.has(target)) {
          return;
        }

        seenTargets.add(target);
        targets.push(target);
        target.classList.add(
          rule.kind === "lines" ? "motion-lines" : "motion-target",
          `motion-${rule.kind}`
        );
        target.style.setProperty("--motion-delay", `${Math.min(index, 5) * rule.stagger}ms`);
      });
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
        target.classList.remove("motion-target", "motion-lines", "is-visible", ...motionClasses);
        target.style.removeProperty("--motion-delay");
      });
    };
  }, []);

  return null;
}
