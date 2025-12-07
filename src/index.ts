export { solve, NotFoundError } from "./solve.js";
export { exists } from "./utils.js";
export { MAIN_FRAME, BFRAME } from "./constants.js";

/**
 * Browser launch arguments for headless servers without audio devices.
 * Use these when launching Playwright browsers on Ubuntu CLI servers or Docker containers.
 * 
 * @example
 * ```typescript
 * import { chromium } from "playwright-core";
 * import { solve, HEADLESS_ARGS } from "recaptcha-solver";
 * 
 * const browser = await chromium.launch({
 *   headless: true,
 *   args: HEADLESS_ARGS
 * });
 * ```
 */
export const HEADLESS_ARGS = [
    "--disable-audio-output",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--mute-audio",
    "--autoplay-policy=no-user-gesture-required",
];
