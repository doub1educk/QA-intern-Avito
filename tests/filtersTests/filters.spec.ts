import { test } from "@playwright/test";
import { MainPage } from "../../pages/mainPage/mainPage";
import { CATEGORIES } from "../../constants/categories";

test.describe("Фильтрация объявлений", () => {
    let mainPage: MainPage;

    test("Фильтр по диапазону цен работает корректно", async ({ page }) => {
        mainPage = new MainPage(page);
        await mainPage.openMainPage();
        const minPrice = 1000;
        const maxPrice = 5000;

        await mainPage.fillPriceFilter(minPrice, maxPrice);
    
        await mainPage.verifyPricesInRange(minPrice, maxPrice);
    });

    test("Применение сортировки по возрастанию", async ({page}) => {
        mainPage = new MainPage(page);
        await mainPage.openMainPage();

        await mainPage.applySorting("price", "asc");

        await mainPage.verifyPricesSortedAscending();
    });

    test("Фильтрация товаров по категории «Недвижимость»", async ({page}) => {
        mainPage = new MainPage(page);
        await mainPage.openMainPage();

        const category = CATEGORIES.REAL_ESTATE;

        await mainPage.selectCategory(category.id);

        await mainPage.verifyAllCardsHaveCategory(category.name);
    });

    test("Работа тогла «Только срочные»", async ({page}) => {
        mainPage = new MainPage(page);
        await mainPage.openMainPage();
        await mainPage.enableOnlyUrgent();

        await mainPage.verifyPriorityValue("urgent");

        await mainPage.verifyAllCardsHaveUrgentBadge();
    });

});

