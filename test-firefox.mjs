import { firefox } from "playwright-core";
import { solve, HEADLESS_ARGS } from "./lib/index.mjs";

// Enable verbose logging
process.env.VERBOSE = "1";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🦊 Testing reCAPTCHA solver with Firefox (headless)\n");

async function main() {
    try {
        console.log("1️⃣  Launching Firefox in HEADLESS mode...");
        const browser = await firefox.launch({
            headless: true,
            args: HEADLESS_ARGS,
        });

        const page = await browser.newPage();
        
        console.log("2️⃣  Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });

        console.log("3️⃣  Solving reCAPTCHA with Firefox...\n");
        console.time("⏱️  Total time");
        
        const solved = await solve(page);
        
        console.timeEnd("⏱️  Total time");
        
        if (solved) {
            console.log("\n✅ reCAPTCHA solved successfully with Firefox!");
        } else {
            console.log("\n✅ No challenge needed (instant pass)");
        }

        console.log("4️⃣  Submitting form...");
        await page.click("#recaptcha-demo-submit");
        await page.waitForTimeout(2000);
        
        console.log("5️⃣  Taking screenshot...");
        await page.screenshot({ path: "test-firefox-result.png" });
        console.log("   📸 Screenshot saved: test-firefox-result.png");

        await browser.close();
        
        console.log("\n🎉 Firefox test passed!");
        console.log("✅ Firefox headless mode works!");
        
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Firefox test failed:");
        console.error("   Error:", error.message);
        
        if (error.message.includes("Executable doesn't exist")) {
            console.error("\n💡 Fix: Install Firefox for Playwright");
            console.error("   npx playwright install firefox");
        }
        
        console.error("\n📋 Full error:");
        console.error(error.stack);
        process.exit(1);
    }
}

main();
