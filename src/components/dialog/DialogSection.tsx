"use client";

import { useState } from "react";

const PLACEHOLDER_DIALOGS = ["Dialog 1", "Dialog 2", "Dialog 3"];

export function DialogSection() {
  const [valgtId, setValgtId] = useState<string>("Dialog 1");

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Venstre panel: dialogliste */}
      <div className="flex flex-col border-r border-ax-border-neutral-subtle md:min-w-[320px] md:max-w-[320px] w-full">
        <div className="flex flex-1 flex-col overflow-y-auto bg-ax-bg-sunken p-2">
          <div className="flex gap-2 p-1 pb-2">
            {/* Ny dialog-knapp og Om dialogen-lenke */}
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            {PLACEHOLDER_DIALOGS.map((d) => (
              <button
                key={d}
                onClick={() => setValgtId(d)}
                className={`h-16 w-full rounded border text-left px-3 text-sm ${valgtId === d ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Høyre område: header + meldinger + svarfelt */}
      <div className="flex flex-1 flex-col overflow-hidden border-l border-ax-border-neutral-subtle">
        {/* DialogHeader */}
        <div className="border-b border-ax-border-neutral-subtle bg-white px-4 py-2">
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>

        {/* Meldinger + svarfelt, side ved side på lg+ */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Meldinger */}
          <div className="flex flex-1 flex-col overflow-y-auto bg-ax-bg-sunken px-4 py-4">
            <div className="h-full min-h-32" />
          </div>

          {/* Svarfelt */}
          <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-ax-border-neutral-subtle p-4 flex-1">
            <div className="flex-1 bg-gray-100 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
