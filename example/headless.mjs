import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

main();

async function main() {
    // Launch browser with headless-friendly arguments
    // This prevents "no audio device detected" errors on Ubuntu CLI servers
    const browser = await chromium.launch({
        headless: true,
        args: HEADLESS_ARGS,
    });

    const page = await browser.newPage();
    await page.goto(EXAMPLE_PAGE);

    console.time("solve reCAPTCHA");
    await solve(page);
    console.log("solved!");
    console.timeEnd("solve reCAPTCHA");

    await page.click("#recaptcha-demo-submit");
    await page.waitForTimeout(2000);

    await browser.close();
    console.log("Done!");
}
