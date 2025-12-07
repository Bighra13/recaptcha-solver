import { chromium } from "playwright-core";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🔍 Testing checkbox detection and clicking...\n");

async function main() {
    try {
        const browser = await chromium.launch({
            headless: false,
            slowMo: 1000,
        });

        const page = await browser.newPage();
        
        console.log("1. Navigating to reCAPTCHA demo page...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "networkidle" });
        
        console.log("2. Waiting 2 seconds...");
        await page.waitForTimeout(2000);

        console.log("3. Looking for reCAPTCHA iframe...");
        const MAIN_FRAME = 'iframe[title="reCAPTCHA"]';
        await page.waitForSelector(MAIN_FRAME, { state: "attached", timeout: 5000 });
        console.log("   ✓ Found iframe");

        const iframe = await page.$(MAIN_FRAME);
        const box_page = await iframe.contentFrame();
        console.log("   ✓ Got iframe content");

        console.log("\n4. Checking what elements exist in the iframe:");
        const elements = await box_page.evaluate(() => {
            const results = [];
            
            // Check for various selectors
            const selectors = [
                '#recaptcha-anchor',
                '#recaptcha-anchor-label',
                '.recaptcha-checkbox',
                '.recaptcha-checkbox-border',
                'div[role="checkbox"]'
            ];
            
            selectors.forEach(sel => {
                const el = document.querySelector(sel);
                results.push({
                    selector: sel,
                    found: !!el,
                    visible: el ? (el.offsetWidth > 0 && el.offsetHeight > 0) : false,
                    classes: el ? el.className : null
                });
            });
            
            return results;
        });
        
        elements.forEach(el => {
            console.log(`   ${el.found ? '✓' : '✗'} ${el.selector}`);
            if (el.found) {
                console.log(`      - Visible: ${el.visible}`);
                console.log(`      - Classes: ${el.classes}`);
            }
        });

        console.log("\n5. Attempting to click #recaptcha-anchor...");
        const anchor = await box_page.$("#recaptcha-anchor");
        if (anchor) {
            console.log("   ✓ Found #recaptcha-anchor element");
            await anchor.click();
            console.log("   ✓ Clicked!");
        } else {
            console.log("   ✗ Could not find #recaptcha-anchor");
        }

        console.log("\n6. Waiting 5 seconds to see the result...");
        await page.waitForTimeout(5000);

        console.log("\n7. Checking if checkbox is now checked...");
        const isChecked = await box_page.evaluate(() => {
            const checkbox = document.querySelector('.recaptcha-checkbox');
            return checkbox ? checkbox.getAttribute('aria-checked') : null;
        });
        console.log(`   Checkbox aria-checked: ${isChecked}`);

        console.log("\n8. Checking if challenge popup appeared...");
        const BFRAME = 'iframe[src*="recaptcha/api2/bframe"]:visible, iframe[src*="recaptcha/enterprise/bframe"]:visible';
        const challengeIframe = await page.$(BFRAME);
        console.log(`   Challenge popup: ${challengeIframe ? 'YES' : 'NO'}`);

        console.log("\n9. Keeping browser open for 10 seconds...");
        await page.waitForTimeout(10000);

        await browser.close();
        console.log("\n✅ Test completed!");
    } catch (error) {
        console.error("\n❌ Error:");
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
