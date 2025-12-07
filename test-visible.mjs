import { chromium } from "playwright-core";
import { solve } from "./lib/index.mjs";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("Testing reCAPTCHA solver with VISIBLE browser...");
console.log("Watch the browser window to see the checkbox being clicked!\n");

async function main() {
    try {
        console.log("1. Launching browser (visible mode)...");
        const browser = await chromium.launch({
            headless: false,  // Visible so you can watch!
            slowMo: 500,      // Slow down actions so you can see them
        });

        console.log("2. Opening new page...");
        const page = await browser.newPage();
        
        console.log("3. Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });
        
        console.log("4. Waiting 2 seconds so you can see the page...");
        await page.waitForTimeout(2000);

        console.log("5. Calling solve() - WATCH THE CHECKBOX!");
        console.log("   You should see:");
        console.log("   - The checkbox being clicked");
        console.log("   - The audio challenge appearing");
        console.log("   - The answer being typed");
        console.log("");
        
        console.time("⏱️  Solved in");
        const solved = await solve(page);
        console.timeEnd("⏱️  Solved in");
        
        if (solved) {
            console.log("\n✅ reCAPTCHA solved successfully!");
            console.log("   The checkbox should now have a green checkmark!");
        } else {
            console.log("\n✅ No challenge needed (instant pass)");
        }
        
        console.log("\n6. Waiting 5 seconds so you can see the result...");
        await page.waitForTimeout(5000);

        await browser.close();
        console.log("\n✅ Test completed!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Test failed:");
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
