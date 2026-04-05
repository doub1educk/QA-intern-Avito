import { test,expect } from "@playwright/test";
import { StatsPage } from "../../pages/statsPage/statsPage";
import { MainPage } from "../../pages/mainPage/mainPage";



test.describe("Работа с автообновлением статистики", () => {
    test("Нажатие «Обновить» сбрасывает прогресс обновления", async ({ page }) => {
        const statsPage = new StatsPage(page);
        const mainPage = new MainPage(page);
        await mainPage.openMainPage();

        await mainPage.clickOnStatLink();
        await expect(async () => {
            const currentWidth = await statsPage.getProgressWidth();
            expect(currentWidth).toBeGreaterThan(0);
        }).toPass({ timeout: 15000 });

        const widthBefore = await statsPage.getProgressWidth();
        console.log(`Полоска заполнилась до: ${widthBefore}%`);

        await statsPage.manualUpdateBtn.click();

        await page.waitForTimeout(500); 
        const widthAfter = await statsPage.getProgressWidth();
    
        expect(widthAfter).toBeLessThan(widthBefore);
    });

    test("Остановка автообновления", async ({ page }) => {
        const statsPage = new StatsPage(page);
        const mainPage = new MainPage(page);
        await mainPage.openMainPage();

        await mainPage.clickOnStatLink();
        await statsPage.setAutoUpdate("off");

        await expect(statsPage.autoUpdateBtn).toHaveAttribute("title", "Включить автообновление");
        await statsPage.expectVisible(statsPage.disabledLabel);
        await statsPage.expectHidden(statsPage.progressFill);
    });

    test("Запуск автообновления после паузы", async ({ page }) => {
        const statsPage = new StatsPage(page);
        const mainPage = new MainPage(page);
        await mainPage.openMainPage();

        await mainPage.clickOnStatLink();

        await statsPage.setAutoUpdate("off");
        await statsPage.expectVisible(statsPage.disabledLabel);

        await statsPage.setAutoUpdate("on");

        await expect(statsPage.autoUpdateBtn).toHaveAttribute("title", "Отключить автообновление");

        await statsPage.expectVisible(statsPage.progressFill);

        await expect(async () => {
            const width = await statsPage.getProgressWidth();
            expect(width).toBeGreaterThan(0);
        }).toPass({ timeout: 10000 });
    });
    
});

