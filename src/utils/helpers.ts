// Utility helper functions
import * as THREE from 'three';

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Convert 3D point to screen coordinates
export const worldToScreen = (
  position: { x: number; y: number; z: number },
  camera: THREE.Camera,
  width: number,
  height: number
): { x: number; y: number } => {
  const vector = new THREE.Vector3(position.x, position.y, position.z);
  vector.project(camera);
  return {
    x: ((vector.x + 1) / 2) * width,
    y: ((-vector.y + 1) / 2) * height,
  };
};

// Generate random point on sphere surface
export const randomPointOnSphere = (radius: number): { x: number; y: number; z: number } => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi),
  };
};

// Generate random point inside sphere
export const randomPointInSphere = (radius: number): { x: number; y: number; z: number } => {
  const point = randomPointOnSphere(radius);
  const scale = Math.cbrt(Math.random());
  return {
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
  };
};

// Format percentage
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// Get status color based on percentage
export const getStatusColor = (percent: number): string => {
  if (percent >= 80) return '#22c55e'; // green
  if (percent >= 60) return '#14b8a6'; // teal
  if (percent >= 40) return '#f59e0b'; // orange
  if (percent >= 20) return '#ef4444'; // red
  return '#6b7280'; // gray
};

// Get health category icon
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    water: '💧',
    vegetation: '🌱',
    animals: '🐾',
    cleanliness: '✨',
    energy: '☀️',
  };
  return icons[category] || '📊';
};
