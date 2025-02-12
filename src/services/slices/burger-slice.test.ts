import { expect, test, describe } from '@jest/globals';

import {
  addIngridient,
  burgerReducer,
  deleteIngridient,
  moveUp,
  moveDown,
  setBun
} from './burger-slice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

describe('тесты синхронных экшенов', () => {
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

    const fakeBun: TIngredient = {
      _id: 'id_fake_bun',
      name: 'fake bun',
      type: '',
      proteins: 3,
      fat: 8,
      carbohydrates: 67,
      calories: 50,
      price: 280,
      image: "string",
      image_large: "imgL",
      image_mobile: "imgM"
    };
    const newState = burgerReducer(initialState, setBun(fakeBun))
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
});
