import { expect, Locator, Page } from "@playwright/test";

export abstract class BasePage {
    protected readonly page: Page;
    readonly themeToggle: Locator;
    readonly statsLink: Locator;


    constructor(page: Page) {
        this.page = page;
        this.themeToggle = page.getByRole("button", { name: /theme/i });
        this.statsLink = page.locator("a[href=\"/stats\"]");
    }

    protected abstract root(): Locator;
    protected abstract pageName: string;

    async waitForOpen() {
        await expect(
            this.root(),
            `Страница ${this.pageName} не открылась`)
            .toBeVisible();
    }

    async waitForUrl(re: RegExp) {
        await expect(this.page).toHaveURL(re);
    }

    async clickAndWaitForUrl(clickTarget: Locator, re: RegExp) {
        await Promise.all([
            this.waitForUrl(re),
            clickTarget.click(),
        ]);
    }

    async fill(locator: Locator, value: string) {
        await locator.fill(value);
    }

    async click(locator: Locator) {
        await locator.click();
    }

    async expectVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async expectHidden(locator: Locator) {
        await expect(locator).toBeHidden();
    }

    async expectEnabled(locator: Locator) {
        await expect(locator).toBeEnabled();
    }

    async clickOnStatLink(){
        await this.statsLink.click();
    }

    async expectDisabled(locator: Locator) {
        await expect(locator).toBeDisabled();
    }
    async clickThemeToggle(){
        await this.themeToggle.click();
    }
    async setTheme(theme: "dark" | "light") {
        const currentLabel = await this.themeToggle.getAttribute("aria-label");
        const isDark = currentLabel?.toLowerCase().includes("light"); 
        if (theme === "dark" && !isDark) {
            await this.themeToggle.click();
        } else if (theme === "light" && isDark) {
            await this.themeToggle.click();
        }
    }
    async openStatPage(){
        await this.statsLink.click();
    }

}
