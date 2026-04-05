import { test, expect, devices } from "@playwright/test";
import { StatsPage } from "../../pages/statsPage/statsPage";
import { MainPage } from "../../pages/mainPage/mainPage";

test.use({ ...devices["iPhone 13"] });

test.describe("Переключение тем в мобильной версии (iPhone 13)", () => {
    


    test("Переключение со светлой на темную тему", async ({ page }) => {
        const statsPage = new StatsPage(page);
        const mainPage = new MainPage(page);
        await mainPage.openMainPage();
        
        await statsPage.setTheme("light");
        
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");

        await statsPage.setTheme("dark");

        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
        await expect(page.locator("body")).toHaveCSS("background-color", "rgb(26, 26, 26)");
    });

    test("Переключение с темной на светлую тему", async ({ page }) => {
        const statsPage = new StatsPage(page);
        const mainPage = new MainPage(page);
        await mainPage.openMainPage();

        await statsPage.setTheme("dark");
        await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

        await statsPage.setTheme("light");

        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    });
});
