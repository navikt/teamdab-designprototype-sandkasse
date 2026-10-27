"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@navikt/ds-react";

let diagramTeller = 0;

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [feil, setFeil] = useState<string | null>(null);
  const [naturligBredde, setNaturligBredde] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const idRef = useRef(`mermaid-diagram-${diagramTeller++}`);

  useEffect(() => {
    let avbrutt = false;
    Promise.all([import("mermaid"), import("@mermaid-js/layout-elk")]).then(async ([{ default: mermaid }, { default: elkLayouts }]) => {
      // ELK ruter linjene vinkelrett og unngår å gå gjennom noder, i motsetning til standardlayouten.
      mermaid.registerLayoutLoaders(elkLayouts);
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "strict",
        layout: "elk",
        elk: { mergeEdges: true, nodePlacementStrategy: "NETWORK_SIMPLEX" },
        flowchart: { curve: "linear" },
        themeCSS: `.edgeLabel p { background-color: #fff; border: 1px solid #b0b0b0; border-radius: 4px; padding: 2px 6px; }`,
      });
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        if (avbrutt) return;
        // Mermaid skalerer SVG-en ned til containerbredden (max-width). Fjernes slik at zoom styrer størrelsen.
        const viewBoxBredde = svg.match(/viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+) [\d.]+"/)?.[1];
        setNaturligBredde(viewBoxBredde ? Number(viewBoxBredde) : null);
        setSvg(svg.replace(/max-width:\s*[\d.]+px;?/, ""));
      } catch (e) {
        if (!avbrutt) setFeil(e instanceof Error ? e.message : "Klarte ikke å tegne diagrammet");
      }
    });
    return () => {
      avbrutt = true;
    };
  }, [chart]);

  if (feil) return <p className="text-ax-text-danger">{feil}</p>;

  const endreZoom = (faktor: number) => setZoom((z) => Math.min(4, Math.max(0.25, z * faktor)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="small" variant="secondary" onClick={() => endreZoom(1 / 1.25)} aria-label="Zoom ut">
          −
        </Button>
        <Button size="small" variant="secondary" onClick={() => endreZoom(1.25)} aria-label="Zoom inn">
          +
        </Button>
        <Button size="small" variant="tertiary" onClick={() => setZoom(1)}>
          Tilbakestill ({Math.round(zoom * 100)} %)
        </Button>
      </div>
      <div className="overflow-auto border border-ax-border-neutral-subtle rounded-lg p-4 max-h-[calc(100vh-14rem)]" tabIndex={0}>
        <div
          style={naturligBredde ? { width: naturligBredde * zoom } : undefined}
          className="[&>svg]:w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
