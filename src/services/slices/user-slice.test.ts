import { configureStore } from "@reduxjs/toolkit";
import { TUser } from "../../utils/types";
import { authChecked, registerUserApiThunk, userLogout, userReducer, userState } from "./user-slice";
import { JSDOM } from "jsdom"

describe('тест синхронных экшенов', () => {
  const fakeUser: TUser = {
    email: 'typoi@.mail',
    name: "Jabo"
  }

  test('тест что пользователь вошел', async () => {
    const initialUserState: userState =
    {
      isLoading: false,
      user: null,
      isAuthChecked: false,
      orders: []
    };

    const newState = userReducer(
      initialUserState, authChecked()
    );
    expect(newState.isAuthChecked).toEqual(true);
  });

  test('тест что пользователь вышел', async () => {
    const initialUserState: userState =
    {
      isLoading: false,
      user: null,
      isAuthChecked: false,
      orders: []
    };

    const newState = userReducer(initialUserState, userLogout());
    expect(newState.user).toEqual(null);
  })
});

describe('тест асинхронных экшенов', () => {

  const fakeRegisterData =
  {
    email: "taksinaa@gmail.com",
    name: "Juja",
    password: "fake password"
  }
  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: "http://localhost/" });

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage
  })


  test('тест регистрация юзера', async () => {
    const fakeRegisterResponse =
    {
      "success": true,
      "user": {
        "email": "taksa@gmail.com",
        "name": "Зюзя"
      },
      "accessToken": "fake-accessToken",
      "refreshToken": "fake-refreshToken"
    };

    const fakeRegisterData =
    {
      email: "taksinaa@gmail.com",
      name: "Juja",
      password: "fake password"
    }

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeRegisterResponse),
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(registerUserApiThunk(fakeRegisterData));
    const newState = store.getState();
    expect(newState.user.isLoading).toEqual(true);
    const a = await dispatchPromise;

    console.log(a);

    const newState2 = store.getState();
    expect(newState2.user.user).toEqual(fakeRegisterResponse.user);
    expect(newState2.user.isLoading).toEqual(false);
  })
  test('тест регистрация юзера rejected', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve("popa"),
      })
    ) as jest.Mock;

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(registerUserApiThunk(fakeRegisterData));
    const newState1 = store.getState();
    expect(newState1.user.isLoading).toEqual(true);
    await dispatchPromise;

    const newState2 = store.getState();
    expect(newState2.user.user).toEqual(null);
    expect(newState2.user.isLoading).toEqual(false);
  });

})