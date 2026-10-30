"use client";

import { useSearchParams } from "next/navigation";
import { useOppsett } from "@/demo/useOppsett";
import { SKJERMER } from "@/spor/skjermer";

export default function MinAktivitetsplanPage() {
  const searchParams = useSearchParams();
  const { spor } = useOppsett();
  const BrukerSide = SKJERMER[spor].BrukerSide;
  return <BrukerSide somVeileder={searchParams.get("somVeileder") === "1"} />;
}
