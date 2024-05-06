const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('Registration Functionality', () => {
    before(async function () {
        this.timeout(60000);
        await driver.get('http://localhost:3000/register'); 
        driver.manage().window().maximize();
    });

    after(async () => {
        await driver.quit();
    });

    it('should register a new user', async function () {
        this.timeout(60000);

        const nameInput = await driver.findElement(By.id('name-input'));
        await driver.wait(until.elementIsVisible(nameInput), 10000);
        await nameInput.sendKeys('John Doe');

        const emailInput = await driver.findElement(By.id('email-input'));
        await driver.wait(until.elementIsVisible(emailInput), 10000);
        await emailInput.sendKeys('john.doe@example.com');

        const passwordInput = await driver.findElement(By.id('password-input'));
        await driver.wait(until.elementIsVisible(passwordInput), 10000);
        await passwordInput.sendKeys('Password@123');

        const signupButton = await driver.findElement(By.id('signup-button'));
        await driver.wait(until.elementIsEnabled(signupButton), 10000);
        await signupButton.click();

    });
});
