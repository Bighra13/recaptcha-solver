import { firefox } from "playwright-core";

const EXAMPLE_PAGE = "https://www.google.com/recaptcha/api2/demo";

console.log("🦊 Simple Firefox Test - Just Loading Page\n");

async function main() {
    try {
        console.log("1. Launching Firefox (headless)...");
        const browser = await firefox.launch({
            headless: true,
        });

        const page = await browser.newPage();
        
        console.log("2. Navigating to reCAPTCHA demo...");
        await page.goto(EXAMPLE_PAGE, { waitUntil: "load", timeout: 30000 });
        console.log("   ✓ Page loaded");
        
        console.log("3. Waiting 3 seconds...");
        await page.waitForTimeout(3000);
        
        console.log("4. Taking screenshot...");
        await page.screenshot({ path: "firefox-page-load.png" });
        console.log("   ✓ Screenshot saved: firefox-page-load.png");
        
        console.log("5. Checking for reCAPTCHA iframe...");
        const iframe = await page.$('iframe[title="reCAPTCHA"]');
        if (iframe) {
            console.log("   ✓ reCAPTCHA iframe FOUND!");
        } else {
            console.log("   ✗ reCAPTCHA iframe NOT FOUND");
            
            // Check what iframes exist
            const allIframes = await page.$$('iframe');
            console.log(`   Found ${allIframes.length} iframe(s) total`);
            
            for (let i = 0; i < allIframes.length; i++) {
                const title = await allIframes[i].getAttribute('title');
                const src = await allIframes[i].getAttribute('src');
                console.log(`   Iframe ${i + 1}: title="${title}", src="${src?.substring(0, 50)}..."`);
            }
        }
        
        console.log("6. Getting page title...");
        const title = await page.title();
        console.log(`   Page title: "${title}"`);
        
        console.log("7. Getting page URL...");
        const url = page.url();
        console.log(`   Current URL: ${url}`);

        await browser.close();
        
        console.log("\n✅ Firefox test completed!");
        
        if (iframe) {
            console.log("✅ Firefox can load reCAPTCHA - ready to use!");
        } else {
            console.log("⚠️  reCAPTCHA not detected - check firefox-page-load.png");
        }
        
    } catch (error) {
        console.error("\n❌ Test failed:");
        console.error("   Error:", error.message);
        console.error("\n📋 Stack:");
        console.error(error.stack);
        process.exit(1);
    }
}

main();
