import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useOrbOrigin } from "../../context/OrbOriginContext";
import "./NameAnimations.css";
import NameDisplay from "./NameDisplay";
import InfoBox from "../ui/InfoBox";
import OrbTrace from "./OrbTrace";

const NAME = "CILLIAN Ó MURCHÚ";
const NAME_LETTERS = NAME.split("");
const O_INDEX = NAME.indexOf("Ó");
const BIO_TEXT =
  "Full-stack engineer specializing in modern web technologies and creative digital experiences.";
const TYPING_INTERVAL_MS = 30;
const HOVER_DELAY_MS = 800;

export function Name() {
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [orbStart, setOrbStart] = useState({ x: 50, y: 100 });
  const [displayedText, setDisplayedText] = useState("");
  const oCharRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showText) return;
    let index = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (index < BIO_TEXT.length) {
        setDisplayedText(BIO_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [showText]);

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setShowText(true), HOVER_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isHovered]);

  const { setOrbOrigin, setOCharPosition } = useOrbOrigin();
  useLayoutEffect(() => {
    if (oCharRef.current) {
      const oRect = oCharRef.current.getBoundingClientRect();
      const center = {
        x: oRect.left + oRect.width / 2,
        y: oRect.top + oRect.height / 2,
      };
      setOrbOrigin(center);
      setOCharPosition(center);
    }
    if (isHovered && oCharRef.current && containerRef.current) {
      const oRect = oCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const oCenterX = oRect.left + oRect.width / 2;
      const oCenterY = oRect.top + oRect.height / 2;
      setOrbStart({
        x: ((oCenterX - containerRect.left) / containerRect.width) * 100,
        y: ((oCenterY - containerRect.top) / containerRect.height) * 100,
      });
    }
  }, [isHovered, setOrbOrigin, setOCharPosition]);

  // Touch has no hover: the first tap shows the info box, the second navigates.
  // Mouse and keyboard navigate straight away (the mouse already hovered).
  const isTap = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const recordPointer = (event: React.PointerEvent) => {
    isTap.current = event.pointerType !== "mouse";
  };
  const handleClick = (event: React.MouseEvent) => {
    if (!isTap.current) return;
    isTap.current = false;
    if (isHovered) {
      setIsHovered(false);
      return;
    }
    event.preventDefault();
    setIsHovered(true);
  };

  // A tap anywhere else dismisses the box opened by a tap.
  useEffect(() => {
    if (!isHovered) return;
    const dismiss = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && !rootRef.current?.contains(event.target as Node)) setIsHovered(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [isHovered]);

  return (
    <div className="relative" ref={rootRef}>
      <div
        className="relative w-40 h-20"
        // Pointer (not mouse) events, so a tap's emulated mouseenter doesn't count as hover.
        onPointerEnter={(event) => event.pointerType === "mouse" && setIsHovered(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setIsHovered(false)}
        ref={containerRef}
      >
        <div className="absolute inset-0" />
        <NameDisplay
          letters={NAME_LETTERS}
          oIndex={O_INDEX}
          oCharRef={oCharRef}
          onPointerDown={recordPointer}
          onClick={handleClick}
        />
        <OrbTrace isHovered={isHovered} orbStart={orbStart} />
      </div>
      {isHovered && (
        <InfoBox
          text={BIO_TEXT}
          displayedText={displayedText}
          className="info-box absolute left-0 mt-8 h-24"
        />
      )}
    </div>
  );
}
