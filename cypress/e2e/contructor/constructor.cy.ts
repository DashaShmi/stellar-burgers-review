
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
    // находим в DOM дереве кнопку с атрибутом data-cy=1
    const li = cy.get(`[data-cy=ingridient-${bulkaId}]`)
    const addButton = li.find('button');
    // кликаем по ней
    addButton.click();

    const bunContainernTop = cy.get(`[data-cy=bun-top]`)
    const bunContainernBottom = cy.get(`[data-cy=bun-bottom]`)

    // проверяем что в div попал текст вверхней булки
    bunContainernTop.contains('Краторная булка N-200i');
    bunContainernTop.contains('верх');

    // проверяем что в div попал текст нижней булки
    bunContainernBottom.contains('(низ)')
  })


})

// модальное окно
// когда мы тыкаем в li по а у ингридиента, то открывется модальное окно
// проверяем что а содержить такой текст 'Биокотлета из марсианской Магнолии'
// тыкаем на крестик, проверяем что окно закрылось, как хз