import { Locator, Page, expect } from "@playwright/test";
import {BasePage} from "../basePage";

export class MainPage extends BasePage {
    protected pageName = "Главная страница";
    private readonly priceRangeContainer: Locator;
    readonly header: Locator;
    readonly urgentToggle: Locator;
    readonly sortBySelector: Locator;
    readonly sortOrder: Locator;
    readonly searchField: Locator;
    readonly minPriceInput: Locator;
    readonly maxPriceInput: Locator;
    readonly categorySelect: Locator;
    readonly priceCards: Locator;
    readonly cardCategories: Locator;
    readonly prioritySelect: Locator;
    readonly cardPriorityBadge: Locator;
    readonly urgentToggleContainer: Locator;
    readonly urgentToggleInput: Locator;
    readonly urgentToggleLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.header = page.locator("header");
        this.urgentToggle = page.locator("input[type=\"checkbox\"][class*=\"urgentToggle__input\"]");
        this.sortBySelector = page.locator("label:has-text(\"Сортировать по\") + select");
        this.sortOrder = page.locator("label:has-text(\"Порядок\") + select");
        this.searchField =  page.locator("div").filter({ hasText: "Поиск по названию" }).locator("input[type=\"text\"]");
        this.priceRangeContainer = page.locator("[class*=\"_filters__priceRange\"]");
        this.minPriceInput = this.priceRangeContainer.getByPlaceholder("От");
        this.maxPriceInput = this.priceRangeContainer.getByPlaceholder("До");
        this.categorySelect = page.locator("label:has-text(\"Категория\") + select");
        this.cardCategories = page.locator("[class*='_card__category_']");
        this.priceCards = page.locator("[class*='_card__price_']"); 
        this.prioritySelect = page.locator("label:has-text(\"Приоритет\") + select");
        this.cardPriorityBadge = page.locator("[class*='_card__priority_']");
        this.urgentToggleContainer = page.locator("div").filter({ hasText: /^Только срочные$/ });
        this.urgentToggleLabel = page.locator("label").filter({ hasText: "Только срочные" });
        this.urgentToggleInput = this.urgentToggleLabel.locator("input");
    }

    protected root(): Locator {
        return this.header;
    }

    async openMainPage() {
        await this.page.goto("/");
        await this.waitForOpen();
    }

    async clickUrgentToggle() {
        await this.urgentToggle.click();
    }

    async fillPriceFilter(min?: number | string, max?: number | string) {
        if (min !== undefined) {
            await this.minPriceInput.fill(min.toString());
        }

        if (max !== undefined) {
            await this.maxPriceInput.fill(max.toString());
        }
    }

    async selectSortBy(option: string) {
        await this.sortBySelector.selectOption(option);
        await this.page.keyboard.press("Enter");
    }
    
    async selectSortOrder(option: string) {
        await this.sortOrder.selectOption(option);
        await this.page.keyboard.press("Enter");
    }
    
    async getAllPrices(): Promise<number[]> {
        await this.priceCards.first().waitFor();
        
        const priceTexts = await this.priceCards.allTextContents();
        
        return priceTexts.map(text => {
            return parseInt(text.replace(/[^\d]/g, ""), 10);
        });
    }

    async verifyPricesInRange(min: number, max: number) {
        
        await this.priceCards.first().waitFor({ state: "visible" });

        const priceTexts = await this.priceCards.allTextContents();
        
        const prices = priceTexts.map(text => parseInt(text.replace(/[^\d]/g, ""), 10));

        expect(prices.length, "Список товаров пуст после фильтрации").toBeGreaterThan(0);

        for (const price of prices) {
            expect(price, `Цена ${price} выходит за пределы [${min} - ${max}]`)
                .toBeGreaterThanOrEqual(min);
            expect(price, `Цена ${price} выходит за пределы [${min} - ${max}]`)
                .toBeLessThanOrEqual(max);
        }
    }

    async applySorting(sortByValue: string, orderValue: string) {
        await this.sortBySelector.waitFor({ state: "visible" });
        await expect(this.sortBySelector).toBeEnabled();
        await this.sortBySelector.selectOption(sortByValue); 
        await this.sortOrder.selectOption(orderValue);   
    }

    async verifyPricesSortedAscending() {
        await this.priceCards.first().waitFor();
        const priceTexts = await this.priceCards.allTextContents();
        const prices = priceTexts.map(text => parseInt(text.replace(/[^\d]/g, ""), 10));

        expect(prices.length, "Список товаров пуст").toBeGreaterThan(1);

        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i], `Цена ${prices[i]} на позиции ${i} должна быть <= цены ${prices[i+1]} на позиции ${i+1}`)
                .toBeLessThanOrEqual(prices[i + 1]);
        }
    }

    async selectCategory(categoryId: string) {
        await this.categorySelect.waitFor({ state: "visible" });
        await this.categorySelect.selectOption(categoryId);
        await this.page.waitForLoadState("networkidle");
    }
    async verifyAllCardsHaveCategory(categoryName: string) {
        const categories = this.page.locator(".card-category"); 
        const count = await categories.count();
        
        for (let i = 0; i < count; i++) {
            await expect(categories.nth(i)).toHaveText(categoryName);
        }
    }
    async enableOnlyUrgent() {
    
        await this.urgentToggleLabel.click();

    
        await expect(this.prioritySelect).toHaveValue("urgent", { timeout: 10000 });
    }
    async verifyPriorityValue(expectedValue: string) {
        await expect(this.prioritySelect).toHaveValue(expectedValue);
    }
    async verifyAllCardsHaveUrgentBadge() {
        await this.cardCategories.first().waitFor({ state: "visible" });

        const cardsLocator = this.page.locator("div[class^=\"_card_\"]")
            .filter({ has: this.page.locator("[class*='__content']") });
    
        const totalCards = await cardsLocator.count();
    
        const urgentBadges = await this.page.locator("span:has-text('Срочно')").count();

        console.log(`Всего карточек на экране: ${totalCards}`);
        console.log(`Из них с пометкой Срочно: ${urgentBadges}`);

     
        expect(totalCards, `ОШИБКА: Фильтр не скрыл лишние объявления! Найдено ${totalCards}, но срочных только ${urgentBadges}`)
            .toBe(urgentBadges);

        expect(totalCards).toBeGreaterThan(0);
    }
}
