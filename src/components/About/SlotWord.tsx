// Text whose vowels are slot-machine reels ("Betsson Group"). When the nearest
// `group` with aria-expanded="true" (WorkEntry's row button) opens, each vowel
// rolls downward through velvet card suits (♠ ♣ ♥) and clunks to a stop on its
// entry in `finals` — a winning line, e.g. four ruby diamonds.
// Each reel gets a random spin length, symbol count and start delay (picked once
// per mount), so they run out of sync and stop in a random order. A beat after
// landing, each final blows away on the wind (WindDust) and its real vowel fades
// back in. Closing rolls them quickly back to the vowels. Screen readers get the
// plain text.
//
// Strip, top to bottom: [tail, final, symbols…, vowel]. At rest it shows the
// vowel at the bottom; open, it rolls down to the final (the ease overshoots a
// touch, briefly showing the tail). Transform only.
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { SuitGem, type Suit } from "./SuitGem";
import { WindDust } from "./WindDust";

const VOWELS = /[aeiou]/i;
const SUITS: Record<string, Suit> = { "♠": "spade", "♣": "club", "♥": "heart" };
const SYMBOLS = Object.keys(SUITS); // the reels spin through velvet spades, clubs and hearts
const CELL_EM = 1.3; // one reel cell; also the letter's line box
const between = (min: number, max: number) => min + Math.random() * (max - min);
const HOLD_MS = 250; // how long a landed final shows before it blows away
const LETTER_AFTER_MS = 250; // the vowel starts fading in this long into the dispersal

// Suits are velvet gems; 💎 is the emoji diamond hue-shifted to ruby (keeps its
// facets and shine); anything else (card ranks, 7) is a bold coral numeral.
const SlotSymbol: React.FC<{ symbol: string }> = ({ symbol }) => {
  if (SUITS[symbol]) return <SuitGem suit={SUITS[symbol]} className="size-[0.58em]" />;
  if (symbol === "💎") return <span className="text-[0.48em] leading-none [filter:hue-rotate(150deg)_saturate(5)_brightness(0.62)_contrast(1.4)]">💎</span>;
  return (
    <span className={cn("font-bold tracking-tight text-highlight", symbol.length > 1 && "relative top-[0.26em] text-[0.58em] tracking-[-0.06em]")}>
      {symbol}
    </span>
  );
};

type Cell = { letter: string } | { symbol: string; final?: boolean };

const Reel: React.FC<{ letter: string; final: string }> = ({ letter, final }) => {
  // Random once per mount: lazy state keeps it stable across re-renders.
  const [{ strip, style, dustAt }] = useState(() => {
    const pick = (): Cell => ({ symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] });
    const symbols = Array.from({ length: Math.round(between(4, 8)) }, pick);
    const strip: Cell[] = [pick(), { symbol: final, final: true }, ...symbols, { letter }];
    const ms = Math.round(between(1300, 2400));
    const delay = Math.round(between(0, 200));
    const dustAt = ms + delay + HOLD_MS;
    const style = {
      "--reel-rest": `${-(strip.length - 1) * CELL_EM}em`,
      "--reel-stop": `${-CELL_EM}em`,
      "--reel-ms": `${ms}ms`,
      "--reel-delay": `${delay}ms`,
      "--dust-at": `${dustAt}ms`,
      "--letter-at": `${dustAt + LETTER_AFTER_MS}ms`,
    } as React.CSSProperties;
    return { strip, style, dustAt };
  });

  return (
    // Invisible letter sizes the box and keeps the baseline; negative margins keep the row height.
    // Clipped top and bottom only, so a wide symbol (10) can spill a little over its neighbours.
    <span className="relative -my-[0.13em] inline-block leading-[1.3]" style={style}>
      <span className="invisible">{letter}</span>
      <span className="absolute inset-0 [clip-path:inset(0_-0.5em)]">
        <span className="absolute inset-x-0 top-0 flex flex-col items-center [transform:translateY(var(--reel-rest))] transition-transform duration-[450ms] ease-in-out group-aria-expanded:duration-(--reel-ms) group-aria-expanded:delay-(--reel-delay) group-aria-expanded:ease-reel motion-safe:group-aria-expanded:[transform:translateY(var(--reel-stop))]">
          {strip.map((cell, i) => (
            <span
              key={i}
              className={cn(
                "flex h-[1.3em] items-center justify-center whitespace-nowrap",
                // The landed final fades and drifts off as its shards blow away.
                "final" in cell &&
                  cell.final &&
                  "transition-[opacity,translate] duration-0 group-aria-expanded:translate-x-[0.12em] group-aria-expanded:opacity-0 group-aria-expanded:duration-300 group-aria-expanded:delay-(--dust-at) motion-reduce:group-aria-expanded:opacity-100",
              )}
            >
              {"letter" in cell ? cell.letter : <SlotSymbol symbol={cell.symbol} />}
            </span>
          ))}
        </span>
      </span>
      <WindDust startMs={dustAt} />
      {/* The real vowel, faded back in over the reel once the final has blown away. */}
      <span className="absolute inset-0 text-center opacity-0 transition-opacity duration-0 group-aria-expanded:opacity-100 group-aria-expanded:duration-500 group-aria-expanded:delay-(--letter-at)">
        {letter}
      </span>
    </span>
  );
};

export const SlotWord: React.FC<{ text: string; finals: string[] }> = ({ text, finals }) => {
  let vowels = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text].map((ch, i) => {
          const final = VOWELS.test(ch) ? finals[vowels++] : undefined;
          return final ? <Reel key={i} letter={ch} final={final} /> : ch;
        })}
      </span>
    </>
  );
};
