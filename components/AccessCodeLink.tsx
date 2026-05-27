"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { accessCodeStorageKey } from "@/lib/accessStorage";

type AccessCodeLinkProps = {
  href: "/espace" | "/en/espace" | "/formulaire" | "/en/formulaire";
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
};

export function AccessCodeLink({ href, className, ariaLabel, children }: AccessCodeLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const storedCode = window.localStorage.getItem(accessCodeStorageKey)?.trim();

    if (!storedCode) {
      return;
    }

    event.preventDefault();
    router.push(`${href}?code=${encodeURIComponent(storedCode)}`);
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}
