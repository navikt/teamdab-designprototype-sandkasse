"use client";

import { useEffect, useRef, useState } from "react";

let diagramTeller = 0;

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [feil, setFeil] = useState<string | null>(null);
  const idRef = useRef(`mermaid-diagram-${diagramTeller++}`);

  useEffect(() => {
    let avbrutt = false;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict" });
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!avbrutt) setSvg(svg);
      } catch (e) {
        if (!avbrutt) setFeil(e instanceof Error ? e.message : "Klarte ikke å tegne diagrammet");
      }
    });
    return () => {
      avbrutt = true;
    };
  }, [chart]);

  if (feil) return <p className="text-ax-text-danger">{feil}</p>;

  return <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
}
