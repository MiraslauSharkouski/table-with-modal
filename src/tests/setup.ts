import "@testing-library/jest-dom";
import { vi } from "vitest";
import "antd/dist/reset.css";

// Mock crypto.randomUUID
if (!globalThis.crypto) {
  globalThis.crypto = {
    randomUUID: () => "test-uuid-" + Math.random().toString(36).substr(2, 9),
  } as any;
}

// Mock matchMedia for AntD components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
