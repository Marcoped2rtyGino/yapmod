/// <reference types="astro/client" />

// User-Agent Client Hints API.
// Not yet part of TypeScript's DOM lib, but supported by Chromium browsers.
interface NavigatorUAData {
  readonly brands: ReadonlyArray<{ brand: string; version: string }>;
  readonly mobile: boolean;
  readonly platform: string;
  readonly platformVersion: string;
  getHighEntropyValues(hints: string[]): Promise<Record<string, unknown>>;
}

interface Navigator {
  readonly userAgentData?: NavigatorUAData;
}
