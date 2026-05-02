import { type MutableRefObject, useEffect, useRef } from "react";
import type { Position3D, ProjectedIcon, SphereState } from "./types";
import { findIconAt, getDistanceToNearestIcon } from "./hitTest";
import { getIconSize } from "./responsive";
import { rotatePoint } from "./rotation";

const DRAG_VELOCITY_MULTIPLIER = 0.0002;
const DRAG_ROTATION_MULTIPLIER = 0.005;
const PERSPECTIVE_NEAR = 1.2;
const PERSPECTIVE_FAR = 1.6;
const SPHERE_PROJECTION_SCALE = 0.36;

interface UseSphereCanvasOptions {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  positions: Position3D[];
  iconNames: string[];
  images: Record<string, HTMLImageElement>;
  persistentState: SphereState;
  mountTime: number;
  onIconClick?: (name: string) => void;
  onIconHover?: (data: { x: number; y: number; name: string } | null) => void;
  fadeInDuration?: number;
  fadeInStagger?: number;
  visible?: boolean;
}

export function useSphereCanvas({
  canvasRef,
  containerRef,
  positions,
  iconNames,
  images,
  persistentState,
  mountTime,
  onIconClick,
  onIconHover,
  fadeInDuration = 400,
  fadeInStagger = 60,
  visible = true,
}: UseSphereCanvasOptions) {
  const sizeRef = useRef(100);
  const screenSizeRef = useRef({ width: 0, height: 0 });
  const isHoveringRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const projectedRef = useRef<ProjectedIcon[]>([]);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRotationRef = useRef<{ rx: number; rz: number }>({
    rx: 0,
    rz: 0,
  });
  const onIconClickRef = useRef(onIconClick);
  const onIconHoverRef = useRef(onIconHover);
  const isVisibleRef = useRef(visible);
  const prevHoveredNameRef = useRef<string | null>(null);

  useEffect(() => {
    onIconClickRef.current = onIconClick;
  }, [onIconClick]);

  useEffect(() => {
    onIconHoverRef.current = onIconHover;
  }, [onIconHover]);

  useEffect(() => {
    isVisibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ─── Screen size tracking ───
    const updateScreenSize = () => {
      screenSizeRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };
    updateScreenSize();

    // ─── Canvas resize handling ───
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const min = Math.min(rect.width, rect.height);
      sizeRef.current = min;
      canvas.width = min * window.devicePixelRatio;
      canvas.height = min * window.devicePixelRatio;
      canvas.style.width = `${min}px`;
      canvas.style.height = `${min}px`;
      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0,
      );
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ─── Mouse event handlers ───
    const handleMouseEnter = () => {
      isHoveringRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      mouseRef.current = null;
      isDraggingRef.current = false;
      dragStartRef.current = null;
      dragCurrentRef.current = null;
      canvas.style.cursor = "default";
      if (prevHoveredNameRef.current !== null) {
        prevHoveredNameRef.current = null;
        onIconHoverRef.current?.(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      isDraggingRef.current = true;
      dragStartRef.current = { x, y };
      dragCurrentRef.current = { x, y };
      dragStartRotationRef.current = {
        rx: persistentState.rx,
        rz: persistentState.rz,
      };
      canvas.style.cursor = "grabbing";
      if (prevHoveredNameRef.current !== null) {
        prevHoveredNameRef.current = null;
        onIconHoverRef.current?.(null);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y };

      if (isDraggingRef.current) {
        dragCurrentRef.current = { x, y };
        canvas.style.cursor = "grabbing";
      } else {
        const hit = findIconAt(x, y, projectedRef.current);
        canvas.style.cursor = hit ? "pointer" : "grab";
        const hitName = hit?.name ?? null;
        if (hitName !== prevHoveredNameRef.current) {
          prevHoveredNameRef.current = hitName;
          onIconHoverRef.current?.(
            hit ? { x: rect.left + hit.x2d, y: rect.top + hit.y2d, name: hit.name } : null
          );
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        !isDraggingRef.current ||
        !dragStartRef.current ||
        !dragCurrentRef.current
      ) {
        isDraggingRef.current = false;
        return;
      }

      const dx = dragCurrentRef.current.x - dragStartRef.current.x;
      const dy = dragCurrentRef.current.y - dragStartRef.current.y;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);

      if (dragDistance > 5) {
        persistentState.vx = -dy * DRAG_VELOCITY_MULTIPLIER;
        persistentState.vy = dx * DRAG_VELOCITY_MULTIPLIER;
      } else {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const hit = findIconAt(x, y, projectedRef.current);
        if (hit && onIconClickRef.current) onIconClickRef.current(hit.name);
      }

      isDraggingRef.current = false;
      dragStartRef.current = null;
      dragCurrentRef.current = null;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // ─── Animation loop ───
    let animationId: number;
    const state = persistentState;

    function draw(now?: number) {
      if (!isVisibleRef.current) {
        animationId = window.setTimeout(() => {
          animationId = requestAnimationFrame(draw);
        }, 100) as unknown as number;
        return;
      }
      const nowVal = typeof now === "number" ? now : performance.now();
      const size = sizeRef.current;
      const iconSize = getIconSize(screenSizeRef.current.width);
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.scale(1, 1);
      ctx.translate(-size / 2, -size / 2);

      let distanceMultiplier = 1;
      if (mouseRef.current && isHoveringRef.current && !isDraggingRef.current) {
        const distanceToIcon = getDistanceToNearestIcon(
          mouseRef.current.x,
          mouseRef.current.y,
          projectedRef.current,
        );
        distanceMultiplier = Math.pow(distanceToIcon, 2);
      }

      if (!isDraggingRef.current) {
        const hoverSlowdown = isHoveringRef.current ? distanceMultiplier : 1;
        const targetVx = state.baseVx * hoverSlowdown;
        const targetVy = state.baseVy * hoverSlowdown;
        state.vx += (targetVx - state.vx) * 0.05;
        state.vy += (targetVy - state.vy) * 0.05;

        state.rx += state.vx;
        state.rz += state.vy;
      } else {
        if (dragStartRef.current && dragCurrentRef.current) {
          const dx = dragCurrentRef.current.x - dragStartRef.current.x;
          const dy = dragCurrentRef.current.y - dragStartRef.current.y;
          state.rx =
            dragStartRotationRef.current.rx - dy * DRAG_ROTATION_MULTIPLIER;
          state.rz =
            dragStartRotationRef.current.rz + dx * DRAG_ROTATION_MULTIPLIER;
        }
      }

      const projected = positions.map((pos, i) => {
        const rotated = rotatePoint(pos, state.rx, state.rz);
        return { ...rotated, name: iconNames[i], index: i };
      });

      projected.sort((a, b) => a.z - b.z);

      const hitTestData: ProjectedIcon[] = [];

      for (const icon of projected) {
        const perspective = PERSPECTIVE_NEAR / (PERSPECTIVE_FAR - icon.z);
        const x2d = size / 2 + icon.x * size * SPHERE_PROJECTION_SCALE * perspective;
        const y2d = size / 2 + icon.y * size * SPHERE_PROJECTION_SCALE * perspective;
        const scaledIconSize = iconSize * perspective;

        hitTestData.push({
          name: icon.name,
          x2d,
          y2d,
          scaledIconSize,
          z: icon.z,
        });

        const img = images[icon.name];
        const elapsed = nowVal - mountTime;
        const fadeInAlpha = Math.min(
          1,
          Math.max(0, (elapsed - icon.index * fadeInStagger) / fadeInDuration),
        );
        const fade3d = 0.4 + 0.6 * ((icon.z + 1) / 2);
        const finalAlpha = icon.z > 0.8 ? 1 : fade3d * fadeInAlpha;

        if (img && img.complete && finalAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = finalAlpha;
          ctx.drawImage(
            img,
            x2d - scaledIconSize / 2,
            y2d - scaledIconSize / 2,
            scaledIconSize,
            scaledIconSize,
          );
          ctx.restore();
        }
      }

      projectedRef.current = hitTestData;
      ctx.restore();
      animationId = requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener("resize", updateScreenSize);

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(animationId);
      ro.disconnect();
      window.removeEventListener("resize", updateScreenSize);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    canvasRef,
    containerRef,
    positions,
    iconNames,
    images,
    persistentState,
    mountTime,
    fadeInDuration,
    fadeInStagger,
  ]);
}
