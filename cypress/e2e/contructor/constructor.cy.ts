
describe('проверяем проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients' });

    cy.visit('http://localhost:4000/');
  });
});

describe('проверяем добавление ингредиента из списка в конструктор', () => {
  before(() => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', { fixture: 'ingredients' });
  })

  it('после клика на "добавить" текст в булке изменился', () => {
    cy.visit('http://localhost:4000/');

    const bulkaId = '643d69a5c3f7b9001cfa093c';// краторная булка
    // находим в DOM дереве кнопку с атрибутом data-cy=
    const li = cy.get(`[data-cy=ingridient-${bulkaId}]`)
    const addButton = li.find('button');
    // кликаем по ней
    addButton.click();

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

    // находим в DOM дереве кнопку с атрибутом data-cy=
    const ingidient1 = cy.get(`[data-cy=ingridient-643d69a5c3f7b9001cfa0941]`);// Биокотлета из марсианской Магнолии
    const ingidient2 = cy.get(`[data-cy=ingridient-643d69a5c3f7b9001cfa093e]`);// Филе Люминесцентного тетраодонтимформа

    ingidient1.find('button').click();
    ingidient2.find('button').click();

    cy.get(`[data-cy=no-bun]`).should("have.length", 2);
    cy.get(`[data-cy=no-bun]`).eq(0).contains("Биокотлета из марсианской Магнолии");
    cy.get(`[data-cy=no-bun]`).eq(1).contains("Филе Люминесцентного тетраодонтимформа");
  });

})

// модальное окно
// когда мы тыкаем в li по а у ингридиента, то открывется модальное окно
// проверяем что а содержить такой текст 'Биокотлета из марсианской Магнолии'
// тыкаем на крестик, проверяем что окно закрылось, как хз