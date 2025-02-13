import { authChecked, userReducer, userState } from "./user-slice";

describe('тест асинхронных экшенов', () => {
  beforeAll(() => {
    // process.env.BURGER_API_URL = "";
  });

  test('тест что пользователь вошел', async () => {
    const initialState: userState =
    {
      isLoading: false,
      user: null,
      isAuthChecked: false,
      orders: []
    };

    const newState = userReducer(
      initialState, authChecked()
    );
    expect(newState.isAuthChecked).toEqual(true);

  })
})