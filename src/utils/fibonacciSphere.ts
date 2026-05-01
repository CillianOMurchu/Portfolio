import type { Position3D } from '../types/sphere';

/**
 * Generates evenly distributed points on a sphere using the Fibonacci sphere algorithm
 * @param count Number of points to generate
 * @returns Array of 3D positions on unit sphere
 */
export function generateFibonacciSphere(count: number): Position3D[] {
  const positions: Position3D[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    positions.push({ x, y, z });
  }
  
  return positions;
}