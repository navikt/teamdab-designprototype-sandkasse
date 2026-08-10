"use client";

import { BodyLong, Link } from "@navikt/ds-react";
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  formatLinks?: boolean;
  formatLinebreaks?: boolean;
}

const linkRegex = /((?:[\w-]+:\/\/?|www(?:-\w+)?\.)[^\s()<>]+)/g;

const replaceMatchesWithNode = (
  text: string,
  regex: RegExp,
  mapFn: (value: string, index: number) => ReactNode
): ReactNode[] => {
  const matches = text.match(regex);
  const results = text.split(regex);
  if (matches !== null) {
    return results.map((value, index) => {
      if (matches.includes(value)) return mapFn(value, index);
      return value;
    });
  }
  return [text];
};

export function CustomBodyLong({ children, className, formatLinks = false, formatLinebreaks = false }: Props) {
  if (!children) return null;

  let newChildren: ReactNode[] = [children];

  if (formatLinks) {
    newChildren = newChildren.flatMap((el) => {
      if (typeof el === "string") {
        return replaceMatchesWithNode(el, linkRegex, (value, index) => {
          const href = value.toLowerCase().startsWith("www.") ? `https://${value}` : value;
          return (
            <Link target="_blank" href={href} key={`link-${index}`}>
              {`${value} (åpnes i ny fane)`}
            </Link>
          );
        });
      }
      return el;
    });
  }

  return (
    <BodyLong className={`${className ?? ""} ${formatLinebreaks ? "whitespace-pre-wrap" : ""}`.trim()}>
      {newChildren}
    </BodyLong>
  );
}
