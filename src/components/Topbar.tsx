"use client";

import { ChevronDownIcon, MagnifyingGlassIcon, InformationSquareIcon } from "@navikt/aksel-icons";
import { useState } from "react";

export function Topbar() {
  const [enhet] = useState("0326 NAV Alna");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{ backgroundColor: "#23262a" }}
      className="flex items-center h-[47px] w-full overflow-hidden shrink-0"
    >
      {/* Domain label */}
      <div
        className="flex items-center h-full pl-6 pr-5 shrink-0"
        style={{ borderRight: "1px solid #525962" }}
      >
        <span
          className="text-white font-semibold text-[20px] leading-7 whitespace-nowrap"
          style={{ fontFamily: "'Source Sans Pro', 'Source Sans 3', sans-serif", letterSpacing: "-0.1px" }}
        >
          Arbeidsrettet oppfølging
        </span>
      </div>

      {/* Enhet selector */}
      <div className="flex items-center px-4 h-full" style={{ borderRight: "1px solid #525962" }}>
        <button
          className="flex items-center gap-2 px-2 py-0.5 rounded border text-white text-sm"
          style={{
            backgroundColor: "#23262a",
            borderColor: "#e0e3e6",
            fontFamily: "'Source Sans Pro', sans-serif",
            minWidth: 160,
          }}
        >
          <span className="flex-1 text-left">{enhet}</span>
          <ChevronDownIcon aria-hidden fontSize="1rem" />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center flex-1 px-4 h-full">
        <div
          className="flex items-center gap-2 flex-1 px-3 rounded"
          style={{ backgroundColor: "#23262a", border: "1px solid #525962", height: 32 }}
        >
          <MagnifyingGlassIcon aria-hidden className="text-white shrink-0" fontSize="1.25rem" />
          <input
            type="text"
            placeholder="Søk"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
            aria-label="Søk"
          />
        </div>
      </div>

      {/* Info icon */}
      <div className="flex items-center px-3 h-full">
        <button
          aria-label="Informasjon"
          className="text-white flex items-center justify-center w-8 h-8 rounded hover:bg-white/10"
        >
          <InformationSquareIcon aria-hidden fontSize="1.25rem" />
        </button>
      </div>

      {/* Meny */}
      <div className="relative flex items-center h-full" style={{ borderLeft: "1px solid #525962" }}>
        <button
          className="flex items-center gap-1 px-4 h-full text-white text-sm font-semibold hover:bg-white/10"
          style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          Meny
          <ChevronDownIcon aria-hidden fontSize="1rem" />
        </button>
        {menuOpen && (
          <ul
            role="menu"
            className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded text-sm text-gray-800 z-50 min-w-[160px]"
          >
            <li role="none">
              <button role="menuitem" className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Personoversikt
              </button>
            </li>
            <li role="none">
              <button role="menuitem" className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Innstillinger
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* User info */}
      <div
        className="flex flex-col items-end justify-center px-4 h-full shrink-0"
        style={{ borderLeft: "1px solid #525962" }}
      >
        <span className="text-white text-sm font-semibold leading-none" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
          Vera Veileder
        </span>
        <span className="text-gray-400 text-xs leading-none mt-0.5">Z867654</span>
      </div>
    </header>
  );
}
