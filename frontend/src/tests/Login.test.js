const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

const driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('Login Functionality', () => {
    before(async function () {
        this.timeout(60000); 
        await driver.get('http://localhost:3000/login'); 
        driver.manage().window().maximize();
    });

    after(async () => {
        await driver.quit();
    });

    it('should log into the user account', async function () {
        this.timeout(60000);

        const emailInput = await driver.findElement(By.id('email-input'));
        const passwordInput = await driver.findElement(By.id('password-input'));
        await emailInput.sendKeys('Michael.Maguire@example.com'); 
        await passwordInput.sendKeys('StrongPassword123!'); 

        
        const loginButton = await driver.findElement(By.id('login-button'));
        await loginButton.click();

        await driver.wait(until.urlContains('/'), 30000);

    });
});
