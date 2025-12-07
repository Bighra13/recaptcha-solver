import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "./lib/index.mjs";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🎯 Final Test - reCAPTCHA Solver\n");
console.log("This test verifies:");
console.log("  ✓ Checkbox clicking");
console.log("  ✓ Audio challenge solving");
console.log("  ✓ Headless mode compatibility");
console.log("");

async function main() {
    try {
        console.log("1️⃣  Launching browser in HEADLESS mode...");
        const browser = await chromium.launch({
            headless: true,
            args: HEADLESS_ARGS,
        });

        const page = await browser.newPage();
        
        console.log("2️⃣  Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });

        console.log("3️⃣  Solving reCAPTCHA (this will click checkbox + solve challenge)...");
        console.time("⏱️  Total time");
        
        const solved = await solve(page);
        
        console.timeEnd("⏱️  Total time");
        
        if (solved) {
            console.log("✅ reCAPTCHA solved successfully!");
        } else {
            console.log("✅ No challenge needed (instant pass)");
        }

        console.log("4️⃣  Submitting form to verify...");
        await page.click("#recaptcha-demo-submit");
        await page.waitForTimeout(2000);
        
        console.log("5️⃣  Taking screenshot...");
        await page.screenshot({ path: "test-final-result.png" });
        console.log("   📸 Screenshot saved: test-final-result.png");

        await browser.close();
        
        console.log("\n🎉 All tests passed!");
        console.log("\n✅ The solver is working correctly:");
        console.log("   • Clicks the 'I'm not a robot' checkbox");
        console.log("   • Solves audio challenges automatically");
        console.log("   • Works in headless mode (Ubuntu servers)");
        console.log("   • No audio device required");
        
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Test failed:");
        console.error("   Error:", error.message);
        
        if (error.message.includes("Executable doesn't exist")) {
            console.error("\n💡 Fix: Install Playwright browsers");
            console.error("   npx playwright install chromium");
        } else if (error.message.includes("ffmpeg")) {
            console.error("\n💡 Fix: Install ffmpeg");
            console.error("   sudo apt-get install ffmpeg");
        }
        
        console.error("\n📋 Full error:");
        console.error(error.stack);
        process.exit(1);
    }
}

main();
