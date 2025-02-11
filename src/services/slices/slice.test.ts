import { expect, test, describe } from '@jest/globals';

import { addIngridient, burgerReducer, deleteIngridient } from './burger-slice';
import { TConstructorIngredient } from '../../utils/types';

describe('тесты синхронных экшенов', () => {

  const fakeIngridient: TConstructorIngredient = {
    _id: "iiiiddd",
    name: 'лук жаренный',
    type: "тип",
    proteins: 4,
    fat: 6,
    carbohydrates: 14,
    calories: 68,
    price: 240,
    image: "картинка",
    image_large: "картинка биг",
    image_mobile: "",
    id: "id-ишник",
  }

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
    }

    const newState = burgerReducer(initialState, addIngridient(fakeIngridient));

    expect(newState.constructorItems.ingredients).toEqual([fakeIngridient])
  })

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
    }
    const newState = burgerReducer(initialState, deleteIngridient({ id: "id-ишник" }));
    expect(newState.constructorItems.ingredients).toEqual([])
  })


});