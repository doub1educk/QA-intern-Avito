import { Locator, Page } from "@playwright/test";
import {BasePage} from "../basePage";

export class StatsPage extends BasePage {
    protected pageName = "Страница модератора";
    readonly title: Locator;
    readonly autoUpdateBtn: Locator;
    readonly manualUpdateBtn: Locator;
    readonly progressFill: Locator;
    readonly disabledLabel: Locator;



    constructor(page: Page) {
        super(page);
        this.title = page.locator("h1:has-text(\"Статистика модератора\")");
        this.autoUpdateBtn = page.getByRole("button", { name: /автообновление/i });
        this.manualUpdateBtn = page.getByLabel("Обновить сейчас");
        this.progressFill = page.locator("[class*=\"_progressFill_\"]");
        this.disabledLabel = page.locator("[class*=\"_disabled_\"]");
    }

    protected root(): Locator {
        return this.title;
    }

    async openMainPage() {
        await this.page.goto("/");
        await this.waitForOpen();
    }

    async openStatsPage() {
        await this.page.goto("/stats");
        await this.waitForOpen();
    }

    async isAutoUpdateActive(): Promise<boolean> {
        const title = await this.autoUpdateBtn.getAttribute("title");
        return title?.includes("Отключить") ?? false;
    }

    async setAutoUpdate(state: "on" | "off") {
        const currentTitle = await this.autoUpdateBtn.getAttribute("title");
    
        if (state === "on" && currentTitle === "Включить автообновление") {
            await this.autoUpdateBtn.click();
        } 
        else if (state === "off" && currentTitle === "Отключить автообновление") {
            await this.autoUpdateBtn.click();
        }
    }

    async clickManualUpdateBtn() {
        await this.manualUpdateBtn.click();
    }
    async getProgressWidth(): Promise<number> {
        const style = await this.progressFill.getAttribute("style");
        const match = style?.match(/width:\s*(\d+)%/);
        return match ? parseInt(match[1]) : 0;
    }

}
