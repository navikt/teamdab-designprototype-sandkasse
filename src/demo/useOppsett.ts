"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Oppsett, hentScenario, medOppsett, parseOppsett } from "./oppsett";

export function useOppsett(): Oppsett {
  const searchParams = useSearchParams();
  return useMemo(() => parseOppsett(searchParams), [searchParams]);
}

export function useScenario() {
  const oppsett = useOppsett();
  return hentScenario(oppsett);
}

// All intern navigasjon skal gå via denne, ellers mister mottakeren oppsettet (spor, scenario, innstillinger).
export function useDemoRouter() {
  const router = useRouter();
  const oppsett = useOppsett();
  return useMemo(
    () => ({
      href: (href: string) => medOppsett(href, oppsett),
      push: (href: string) => router.push(medOppsett(href, oppsett)),
      replace: (href: string) => router.replace(medOppsett(href, oppsett)),
      back: () => router.back(),
    }),
    [router, oppsett],
  );
}
