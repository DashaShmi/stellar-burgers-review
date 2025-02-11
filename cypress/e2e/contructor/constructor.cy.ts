import { setCookie } from "../../../src/utils/cookie";

const cratorBunId = '643d69a5c3f7b9001cfa093c';// Kраторная булка
const cutletId = '643d69a5c3f7b9001cfa0941';// Биокотлета из марсианской Магнолии
const filletId = '643d69a5c3f7b9001cfa093e';//Филе Люминесцентного тетраодонтимформа

function setupFakeApi() {
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients' });
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', { fixture: 'user' });
  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', { fixture: 'order' });
}

function getIngridientButton(ingridientId: string): Cypress.Chainable<JQuery<HTMLButtonElement>> {
  const li = cy.get(`[data-cy=ingridient-${ingridientId}]`)
  const addButton = li.find('button');

  return addButton;
}

describe('проверяем проверяем доступность приложения', function () {
  beforeEach(() => setupFakeApi());

  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit('http://localhost:4000/');
  });
});

describe('проверяем добавление ингредиента из списка в конструктор', () => {
  beforeEach(() => setupFakeApi())

  it('после клика на "добавить" текст в булке изменился', () => {
    cy.visit('http://localhost:4000/');

    getIngridientButton(cratorBunId).click();

    const bunContainernTop = cy.get(`[data-cy=bun-top]`);
    const bunContainernBottom = cy.get(`[data-cy=bun-bottom]`);

    // проверяем что в div попал текст вверхней булки
    bunContainernTop.contains('Краторная булка N-200i');
    bunContainernTop.contains('верх');

    // проверяем что в div попал текст нижней булки
    bunContainernBottom.contains('(низ)')
  });

  it('добавление начинок', () => {
    cy.visit('http://localhost:4000/');

    getIngridientButton(cutletId).click();
    getIngridientButton(filletId).click();

    cy.get(`[data-cy=no-bun]`).should("have.length", 2);
    cy.get(`[data-cy=no-bun]`).eq(0).contains("Биокотлета из марсианской Магнолии");
    cy.get(`[data-cy=no-bun]`).eq(1).contains("Филе Люминесцентного тетраодонтимформа");
  });

  it('открытие модалки, детальное описание', () => {
    cy.visit('http://localhost:4000/');
    const ingidient1 = cy.get(`[data-cy=ingridient-${cutletId}]`);
    ingidient1.find('a').click();

    cy
      .get(`[data-cy=modal]`)
      .find(`[data-cy=ingidientDetail]`)
      .contains('Биокотлета из марсианской Магнолии');
  })

  it('детальное описание по прямой ссылке открывается без модалки', () => {
    cy.visit(`http://localhost:4000/ingredients/${filletId}`);
    cy.get(`[data-cy=modal]`).should('not.exist');
    cy.get(`[data-cy=ingidientDetail]`).contains('Филе Люминесцентного тетраодонтимформа');
  })

  it('закрытие модалки на крестик', () => {
    cy.visit('http://localhost:4000/');
    const ingidient1 = cy.get(`[data-cy=ingridient-${cutletId}]`);
    ingidient1.find('a').click();
    const buttonClose = cy.get(`[data-cy=button-close]`);
    buttonClose.click();
    cy.get(`[data-cy=modal]`).should('not.exist');
  })
  it('закрытие модалки кликом на оверлей', () => {
    cy.visit('http://localhost:4000/');
    const ingidient1 = cy.get(`[data-cy=ingridient-${cutletId}]`);
    ingidient1.find('a').click();
    const overlay = cy.get(`[data-cy=overlay]`);
    overlay.click({ force: true });
    cy.get(`[data-cy=modal]`).should('not.exist');
  })
})

describe('тест на запрос данных пользователя и заказа, Проверяется, что модальное окно открылось и номер заказа верный', () => {
  beforeEach(() => setupFakeApi())

  it('собираем заказ в конструкторе бургера', () => {
    setCookie('accessToken', 'popa');

    cy.visit('http://localhost:4000/');
    getIngridientButton(cratorBunId).click();
    getIngridientButton(cutletId).click();
    getIngridientButton(filletId).click();

    const buttonOrder = cy.get(`[data-cy=button-order]`);
    buttonOrder.find('button').click();

    cy
      .get(`[data-cy=modal]`).find(`[data-cy=orderDetail]`)
      .contains('67937');
  });

  it('Закрывается модальное окно и проверяется успешность закрытия.', () => {
    setCookie('accessToken', 'popa');

    cy.visit('http://localhost:4000/');
    getIngridientButton(cratorBunId).click();
    getIngridientButton(cutletId).click();
    getIngridientButton(filletId).click();

    const buttonOrder = cy.get(`[data-cy=button-order]`);
    buttonOrder.find('button').click();
    const buttonClose = cy.get(`[data-cy=button-close]`);
    buttonClose.click();
    cy.get(`[data-cy=modal]`).should('not.exist');

    const bunСhooseTop = cy.get(`[data-cy=bun-сhooseTop]`);
    bunСhooseTop.contains('Выберите булки');
  })
});


