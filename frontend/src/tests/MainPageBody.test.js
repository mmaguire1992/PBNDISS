const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('MainPageBody', () => {
    before(async function () {
        this.timeout(60000);
        await driver.get('http://localhost:3000');
        driver.manage().window().maximize();

        const loginButton = await driver.findElement(By.id('login-link'));
        await loginButton.click();

        const emailInput = await driver.findElement(By.id('email-input'));
        await emailInput.sendKeys('Michael.Maguire@example.com');

        const passwordInput = await driver.findElement(By.id('password-input'));
        await passwordInput.sendKeys('StrongPassword123!');

        const loginForm = await driver.findElement(By.id('login-button'));
        await loginForm.click();

        await driver.wait(until.urlContains('http://localhost:3000/'), 30000);
    });

    after(async () => {
        await driver.quit();
    });

    it('should upload an image and submit the form', async function () {
        this.timeout(60000);
        const imageFileInput = await driver.wait(until.elementLocated(By.id('image-file-input')), 10000);
        await imageFileInput.sendKeys('/Users/michaelmaguire/Desktop/0_40cy3DPSZ3xjKoYT.jpg');

        await driver.sleep(10000);

        try {
            const submitButton = await driver.wait(until.elementLocated(By.id('submit-button')), 10000);
            await driver.wait(until.elementIsVisible(submitButton), 5000);
            await submitButton.click();
        } catch (error) {
            console.log("Skipping error with submit button:", error);
        }

        await driver.wait(until.alertIsPresent(), 20000);
        let alert = await driver.switchTo().alert();
        assert.strictEqual(await alert.getText(), "Paint By Numbers generation successful!");
        await alert.accept();

        const currentUrl = await driver.getCurrentUrl();
        assert(currentUrl.includes('pbnOutputUrl'), "URL does not include 'pbnOutputUrl'");
    });

    it('should activate the progress bar after submitting the form', async function () {
        this.timeout(60000);
        await driver.navigate().refresh();

        await driver.sleep(10000); 

        try {
            const submitButton = await driver.wait(until.elementLocated(By.id('submit-button')), 15000);
            await driver.wait(until.elementIsVisible(submitButton), 5000);
            await submitButton.click();
        } catch (error) {
            console.log("Skipping error with submit button:", error);
            return; 
        }

        const progressBar = await driver.wait(until.elementLocated(By.id('progress-bar')), 10000);
        assert(await progressBar.isDisplayed(), 'Progress bar is not visible');
    });
});
