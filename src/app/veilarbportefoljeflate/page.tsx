"use client";

import { useEffect } from "react";
import { useDemoRouter } from "@/demo/useOppsett";

// `redirect()` fra next/navigation krever en server og støttes ikke ved
// statisk eksport (output: "export"). Gjør derfor redirect på klienten.
export default function VeilarbportefoljeflatePage() {
  const router = useDemoRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
