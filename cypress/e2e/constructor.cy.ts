describe('Проверка работоспособности приложения', () => {

    beforeEach(() => {
        window.localStorage.setItem('refreshToken', 'testRefreshToken');
        cy.setCookie('accessToken', 'testAccessToken');
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json'});
        cy.viewport(1300, 800);
        cy.visit('http://localhost:4000');
        cy.intercept('GET', 'api/orders/all', { fixture: 'orders.json'});
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json'});
    });

    const noBunSelector1 = `[data-cy=no_bun_text_1]`;
    const noBunSelector2 = `[data-cy=no_bun_text_2]`;
    const noIngredientsSelector = `[data-cy=no_ingredients_text]`;
    const bunSelector = `[data-cy=bun_0]`;
    const ingredientSelector = `[data-cy=ingredient_0]`;

    it('есть возможность добавлять булку и ингридиенты', () => {
        cy.get(noBunSelector1).as('noBunText1');
        cy.get(noBunSelector2).as('noBunText2');
        cy.get(noIngredientsSelector).as('noIngredientsText');
        cy.get(bunSelector + ` button`).as('bun');
        cy.get(ingredientSelector + ` button`).as('ingredient');

        // Проверяем пустоту перед добавлением
        cy.get('@noBunText1').contains('Выберите булки');
        cy.get('@noBunText2').contains('Выберите булки');
        cy.get('@noIngredientsText').contains('Выберите начинку');

        cy.get('@bun').click();
        cy.get('@ingredient').click({ multiple: true });

        cy.get(`[data-cy=constructor_section]`).contains('булка');
        cy.get(`[data-cy=ingredient_element]`);
    });

    it('проверка открытия и закрытия модального окна ингридиента', () => {
        const ingredient = cy.get(bunSelector);
        ingredient.click();

        cy.get(`[data-cy=ingredient_modal]`);
        cy.get(`[data-cy=close_modal_btn]`).click();
    });

    it('проверка нового заказа', () => {
        const bun = cy.get(bunSelector + ` button`);
        const ingredient = cy.get(ingredientSelector + ` button`);
        bun.click();
        ingredient.click({ multiple: true });

        cy.get(`[data-cy=new_order_total] button`).click();

        //cy.intercept('POST', 'api/orders', { fixture: 'newOrderBurger.json'}).as('newOrder');
        cy.fixture('newOrderBurger.json').then((newOrder) => {
            cy.intercept(
            {
                method: 'POST',
                url: "api/orders"
            },
            newOrder
            ).as('newOrder');

            cy.get(`[data-cy=new_order_number]`).contains(newOrder.order.number);
            cy.get(`[data-cy=close_modal_btn]`).click();

            // Проверяем пустоту после закрытия модалки
            cy.get(noBunSelector1).as('noBunText1');
            cy.get(noBunSelector2).as('noBunText2');
            cy.get(noIngredientsSelector).as('noIngredientsText');

            cy.get('@noBunText1').contains('Выберите булки');
            cy.get('@noBunText2').contains('Выберите булки');
            cy.get('@noIngredientsText').contains('Выберите начинку');
        });
        
    });
    afterEach(() => {
        cy.clearAllCookies();
        cy.clearAllLocalStorage();
    });
});