import { expect, test, describe } from '@jest/globals';

import { JSDOM } from 'jsdom';

import {
  addIngridient,
  burgerReducer,
  deleteIngridient,
  moveUp,
  moveDown,
  setBun,
  getIngredientsApiThunk,
  getFeedsApiThunk,
  orderBurgerApiThunk,
  getOrderByNumberApiThunk
} from './burger-slice';
import { TConstructorIngredient, TIngredient, TOrder } from '../../utils/types';
import { configureStore } from '@reduxjs/toolkit';
import { TFeedsResponse } from '../../utils/burger-api';

const fakeIngridient: TConstructorIngredient = {
  _id: '_fakeId1',
  name: 'лук жаренный',
  type: 'тип',
  proteins: 4,
  fat: 6,
  carbohydrates: 14,
  calories: 68,
  price: 240,
  image: 'картинка',
  image_large: 'картинка биг',
  image_mobile: '',
  id: 'fakeIng1'
};

const fakeIngridient2: TConstructorIngredient = {
  _id: '_fakeId2',
  name: 'картошечка',
  type: 'тиап',
  proteins: 3,
  fat: 46,
  carbohydrates: 144,
  calories: 8,
  price: 450,
  image: 'картинкаа',
  image_large: 'картинка бииг',
  image_mobile: '',
  id: 'fakeIng2'
};

const fakeOrder: TOrder = {
  _id: 'id fake_1',
  status: 'fake status',
  name: 'fake name',
  createdAt: 'fake createdAt',
  updatedAt: 'fake updatedAt',
  number: 23,
  ingredients: [fakeIngridient.id]
};

const fakeBun: TIngredient = {
  _id: 'id_fake_bun',
  name: 'fake bun',
  type: '',
  proteins: 3,
  fat: 8,
  carbohydrates: 67,
  calories: 50,
  price: 280,
  image: 'string',
  image_large: 'imgL',
  image_mobile: 'imgM'
};

describe('тесты синхронных экшенов', () => {
  test('обработка экшена добавления ингредиента', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };

    const newState = burgerReducer(initialState, addIngridient(fakeIngridient));

    expect(newState.constructorItems.ingredients).toEqual([fakeIngridient]);
  });

  test('обработка экшена добавления булки', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: null
    };

    const newState = burgerReducer(initialState, setBun(fakeBun));
    expect(newState.constructorItems.bun).toEqual(fakeBun);
  });

  test('обработка экшена удаления ингредиента', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      constructorItems: {
        bun: null,
        ingredients: [fakeIngridient]
      },
      orderRequest: false,
      orderModalData: null
    };
    const newState = burgerReducer(
      initialState,
      deleteIngridient({ id: 'id-ишник' })
    );
    expect(newState.constructorItems.ingredients).toEqual([]);
  });

  test('обработка экшена  изменения ингредиентов в начинке Вверх', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      constructorItems: {
        bun: null,
        ingredients: [fakeIngridient, fakeIngridient2]
      },
      orderRequest: false,
      orderModalData: null
    };

    const newState = burgerReducer(initialState, moveUp(fakeIngridient2));
    expect(newState.constructorItems.ingredients).toEqual([
      fakeIngridient2,
      fakeIngridient
    ]);
  });

  test('обработка экшена  изменения ингредиентов в начинке Вниз', () => {
    const initialState = {
      ingredients: [],
      isLoading: false,
      feed: {
        orders: [],
        total: 0,
        totalToday: 0
      },
      constructorItems: {
        bun: null,
        ingredients: [fakeIngridient, fakeIngridient2]
      },
      orderRequest: false,
      orderModalData: null
    };

    const newState = burgerReducer(initialState, moveDown(fakeIngridient));
    expect(newState.constructorItems.ingredients).toEqual([
      fakeIngridient2,
      fakeIngridient
    ]);
  });

  describe('тест асинхронных экшенов', () => {
    test('тест загрузки ингредиентов fulfilled', async () => {
      const expectedResult = [fakeIngridient, fakeIngridient2];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: expectedResult })
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(getIngredientsApiThunk());
      const newState1 = store.getState();
      // ...если тут проверим, должна быть загрузка
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;

      const newState2 = store.getState();

      expect(newState2.burger.ingredients).toEqual(expectedResult);
      expect(newState2.burger.isLoading).toEqual(false);
    });

    test('тест загрузки ингредиентов rejected', async () => {
      const expectedResult: unknown[] = [];

      global.fetch = jest.fn(() => Promise.reject('popa')) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(getIngredientsApiThunk());
      const newState1 = store.getState();
      // ...если тут проверим, должен быть загрузка
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;

      const newState2 = store.getState();

      expect(newState2.burger.ingredients).toEqual(expectedResult);
      expect(newState2.burger.isLoading).toEqual(false);
    });

    test('тест загрузки заказа fulfilled', async () => {
      const expectedResult = {
        success: true,
        orders: [fakeOrder],
        total: 55,
        totalToday: 23
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(expectedResult)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(getFeedsApiThunk());
      const newState1 = store.getState();
      // ...если тут проверим, должна быть загрузка
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;
      const newState2 = store.getState();

      expect(newState2.burger.feed).toEqual(expectedResult);
      expect(newState2.burger.isLoading).toEqual(false);
    });

    test('тест загрузки заказа rejected', async () => {
      const expectedResult = {
        orders: [],
        total: 0,
        totalToday: 0
      };

      global.fetch = jest.fn(() => Promise.reject('popa')) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(getFeedsApiThunk());
      const newState1 = store.getState();
      // ...если тут проверим, должен быть загрузка
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;

      const newState2 = store.getState();

      expect(newState2.burger.feed).toEqual(expectedResult);
      expect(newState2.burger.isLoading).toEqual(false);
    });

    const orderResponse = {
      success: true,
      name: 'Краторный био-марсианский бургер',
      order: {
        ingredients: [
          {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/bun-02-large.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa0941',
            name: 'Биокотлета из марсианской Магнолии',
            type: 'main',
            proteins: 420,
            fat: 142,
            carbohydrates: 242,
            calories: 4242,
            price: 424,
            image: 'https://code.s3.yandex.net/react/code/meat-01.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-01-large.png',
            __v: 0
          },
          {
            _id: '643d69a5c3f7b9001cfa093c',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
            image_large:
              'https://code.s3.yandex.net/react/code/bun-02-large.png',
            __v: 0
          }
        ],
        _id: '67acc38d133acd001be50724',
        owner: {
          name: 'Зак Фигзак',
          email: 'ulmer.morozov@gmail.com',
          createdAt: '2025-01-06T18:59:38.711Z',
          updatedAt: '2025-01-06T19:06:40.834Z'
        },
        status: 'done',
        name: 'Краторный био-марсианский бургер',
        createdAt: '2025-02-12T15:51:41.544Z',
        updatedAt: '2025-02-12T15:51:42.218Z',
        number: 68259,
        price: 2934
      }
    };

    test('тест отправки заказа fulfilled', async () => {
      const dom = new JSDOM();
      global.document = dom.window.document;

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(orderResponse)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });
      const dispatchPromise = store.dispatch(
        orderBurgerApiThunk([fakeIngridient._id])
      );
      const newState1 = store.getState();
      // ...если тут проверим, должна быть загрузка
      expect(newState1.burger.orderRequest).toEqual(true);
      // ждем завершения санки
      const a = await dispatchPromise;
      const newState2 = store.getState();
      expect(newState2.burger.orderRequest).toEqual(false);
      expect(newState2.burger.orderModalData).toEqual(orderResponse.order);
    });

    test('тест на очищение бургера после заказа', async () => {
      const dom = new JSDOM();
      global.document = dom.window.document;

      const initialState = {
        ingredients: [],
        isLoading: false,
        feed: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        constructorItems: {
          bun: fakeBun,
          ingredients: [fakeIngridient, fakeIngridient2]
        },
        orderRequest: false,
        orderModalData: null
      };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(orderResponse)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer },
        preloadedState: {
          burger: initialState
        }
      });

      await store.dispatch(orderBurgerApiThunk([fakeIngridient._id]));
      const newState = store.getState();
      expect(newState.burger.constructorItems.bun).toEqual(null);
      expect(newState.burger.constructorItems.ingredients).toEqual([]);
    });

    test('тест отправки заказа rejected/pending', async () => {
      const dom = new JSDOM();
      global.document = dom.window.document;

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(orderResponse)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(
        orderBurgerApiThunk([fakeIngridient._id])
      );
      const newState1 = store.getState();
      expect(newState1.burger.orderRequest).toEqual(true);
      await dispatchPromise;
      const newState2 = store.getState();
      expect(newState2.burger.orderRequest).toEqual(false);
    });

    test('тест на получение заказа по номеру заказа (не id) fulfilled', async () => {
      const fakeOrderId = 12345;

      const fakeOrderResponseByNumber = {
        success: true,
        orders: [
          {
            _id: '67ade227133acd001be50a0f',
            ingredients: [
              '643d69a5c3f7b9001cfa093d',
              '643d69a5c3f7b9001cfa0942',
              '643d69a5c3f7b9001cfa093d'
            ],
            owner: '675c4672750864001d371042',
            status: 'done',
            name: 'Флюоресцентный spicy бургер',
            createdAt: '2025-02-13T12:14:31.973Z',
            updatedAt: '2025-02-13T12:14:32.651Z',
            number: 68333,
            __v: 0
          }
        ]
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fakeOrderResponseByNumber)
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(
        getOrderByNumberApiThunk(fakeOrderId)
      );
      const newState1 = store.getState();
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;
      const newState = store.getState();
      expect(newState.burger.orderModalData).toEqual(
        fakeOrderResponseByNumber.orders[0]
      );
      expect(newState.burger.isLoading).toEqual(false);
    });

    test('тест на получение заказа по номеру заказа (не id) rejected', async () => {
      const fakeOrderId = 12345;

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject('popa')
        })
      ) as jest.Mock;

      const store = configureStore({
        reducer: { burger: burgerReducer }
      });

      const dispatchPromise = store.dispatch(
        getOrderByNumberApiThunk(fakeOrderId)
      );
      const newState1 = store.getState();
      expect(newState1.burger.isLoading).toEqual(true);
      // ждем завершения санки
      await dispatchPromise;
      const newState = store.getState();
      expect(newState.burger.isLoading).toEqual(false);
    });
  });
});
