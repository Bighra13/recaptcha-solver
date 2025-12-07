import { chromium } from "playwright-core";
import { solve, HEADLESS_ARGS } from "recaptcha-solver";

/**
 * Complete automation example showing how solve() handles everything automatically:
 * 1. Clicks the "I'm not a robot" checkbox
 * 2. Solves any audio challenge that appears
 * 3. Retries if needed
 * 
 * Works on headless Ubuntu servers without audio devices!
 */

async function main() {
    console.log("🤖 Complete reCAPTCHA Automation Example\n");
    
    // Launch browser with headless-friendly arguments
    const browser = await chromium.launch({
        headless: true,  // Works perfectly in headless mode!
        args: HEADLESS_ARGS,
    });

    const page = await browser.newPage();
    
    // Example 1: Standard reCAPTCHA v2
    console.log("📝 Example 1: Standard reCAPTCHA v2");
    console.log("   URL: https://www.google.com/recaptcha/api2/demo");
    await page.goto("https://www.google.com/recaptcha/api2/demo");
    
    console.log("   🔄 Calling solve()...");
    console.log("      - Will automatically click the checkbox");
    console.log("      - Will solve any challenge that appears");
    console.time("   ⏱️  Solved in");
    
    const solved = await solve(page);
    
    console.timeEnd("   ⏱️  Solved in");
    console.log(`   ✅ Result: ${solved ? "Challenge solved!" : "No challenge needed"}\n`);
    
    // Submit the form to verify it worked
    await page.click("#recaptcha-demo-submit");
    await page.waitForTimeout(2000);
    
    // Example 2: Invisible reCAPTCHA
    console.log("📝 Example 2: Invisible reCAPTCHA");
    console.log("   URL: https://recaptcha-demo.appspot.com/recaptcha-v2-invisible.php");
    
    const page2 = await browser.newPage();
    await page2.goto("https://recaptcha-demo.appspot.com/recaptcha-v2-invisible.php");
    
    // Trigger the invisible reCAPTCHA
    await page2.click("text=Submit ↦");
    
    console.log("   🔄 Calling solve()...");
    console.time("   ⏱️  Solved in");
    
    const solved2 = await solve(page2);
    
    console.timeEnd("   ⏱️  Solved in");
    console.log(`   ✅ Result: ${solved2 ? "Challenge solved!" : "No challenge needed"}\n`);
    
    await page2.close();
    
    // Example 3: Your own site with reCAPTCHA
    console.log("📝 Example 3: Custom site integration");
    console.log("   This is how you'd use it in your automation:\n");
    console.log("   ```javascript");
    console.log("   await page.goto('https://your-site.com/login');");
    console.log("   ");
    console.log("   // Fill in your form");
    console.log("   await page.type('#username', 'your-username');");
    console.log("   await page.type('#password', 'your-password');");
    console.log("   ");
    console.log("   // Solve reCAPTCHA automatically");
    console.log("   await solve(page);");
    console.log("   ");
    console.log("   // Submit form");
    console.log("   await page.click('#login-button');");
    console.log("   ```\n");
    
    await browser.close();
    
    console.log("🎉 All examples completed!");
    console.log("\n💡 Key Points:");
    console.log("   • solve() is fully automatic - no manual clicking needed");
    console.log("   • Works in headless mode with HEADLESS_ARGS");
    console.log("   • Handles both visible and invisible reCAPTCHA");
    console.log("   • Automatically retries if first attempt fails");
    console.log("   • Perfect for Ubuntu CLI servers and Docker containers");
}

main().catch(console.error);
