import { expect, test, describe } from '@jest/globals';
import { addIngridient, burgerReducer } from './burger-slice';
import { TConstructorIngredient } from '../../utils/types';

describe('тесты синхронных экшенов', () => {

  const initialTracksState = {
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

  test('обработка экшена добавления ингредиента', () => {

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
    const newState = burgerReducer(initialTracksState, addIngridient(fakeIngridient));
    initialTracksState.constructorItems.ingredients
    newState.constructorItems.ingredients

    expect(newState.constructorItems.ingredients).toEqual({
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
    })
  })

});