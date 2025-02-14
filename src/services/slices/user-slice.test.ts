import { configureStore } from "@reduxjs/toolkit";
import { TUser } from "../../utils/types";
import { authChecked, getOrdersApiThunk, loginUserThunk, registerUserApiThunk, updateUserApiThank, userLogout, userReducer, userState } from "./user-slice";
import { JSDOM } from "jsdom"
import { TLoginData } from "../../utils/burger-api";

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
      user: fakeUser,
      isAuthChecked: false,
      orders: []
    };

    const newState = userReducer(initialUserState, userLogout());
    expect(newState.user).toEqual(null);
  })
});

describe('тест асинхронных экшенов', () => {
  beforeEach(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: "http://localhost/" });

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const fakeRegisterData =
  {
    email: "taksinaa@gmail.com",
    name: "Juja",
    password: "fake password"
  }

  const fakeLoginData: TLoginData = {
    email: 'fakeEmailLoginData',
    password: 'fakePasswordLoginData'
  }

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

    jest
      .spyOn(global, "fetch")
      .mockImplementation
      (
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakeRegisterResponse),
          } as Response)
      );

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(registerUserApiThunk(fakeRegisterData));
    const newState = store.getState();

    expect(newState.user.isLoading).toEqual(true);

    await dispatchPromise;

    const newState2 = store.getState();

    expect(newState2.user.user).toEqual(fakeRegisterResponse.user);
    expect(newState2.user.isLoading).toEqual(false);
  });

  test('тест регистрация юзера rejected', async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject("popa"));

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

  test('тест лог-ина юзера', async () => {
    const fakeLoginResponse =
    {
      "success": true,
      "accessToken": "fake-accessToken",
      "refreshToken": "fake-refreshToken",
      "user": {
        "email": "taksa@gmail.com",
        "name": "Зюзя"
      }
    }

    jest
      .spyOn(global, "fetch")
      .mockImplementation
      (
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakeLoginResponse)
          } as Response)
      );

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(loginUserThunk(fakeLoginData));
    const newState1 = store.getState();

    expect(newState1.user.isLoading).toEqual(true);

    await dispatchPromise;

    const newState2 = store.getState();

    expect(newState2.user.isLoading).toEqual(false);
    expect(newState2.user.user).toEqual(fakeLoginResponse.user);
  });

  test('тест лог-ина юзера rejected', async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject("popa"));

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(loginUserThunk(fakeLoginData));
    const newState1 = store.getState();
    expect(newState1.user.isLoading).toEqual(true);
    await dispatchPromise;
    const newState2 = store.getState();

    expect(newState2.user.user).toEqual(null);
    expect(newState2.user.isLoading).toEqual(false);
  });

  const orderResponse =
  {
    "success": true,
    "orders": [
      {
        "_id": "67af46bb133acd001be50d3d",
        "ingredients": [
          "643d69a5c3f7b9001cfa093d",
          "643d69a5c3f7b9001cfa093e",
          "643d69a5c3f7b9001cfa093d"
        ],
        "status": "done",
        "name": "Флюоресцентный люминесцентный бургер",
        "createdAt": "2025-02-14T13:35:55.508Z",
        "updatedAt": "2025-02-14T13:35:56.338Z",
        "number": 68416
      }
    ],
    "total": 68042,
    "totalToday": 82
  };

  test('тест на получение заказов', async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation
      (
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(orderResponse)
          } as Response)
      );

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(getOrdersApiThunk());
    const newState1 = store.getState();
    expect(newState1.user.isLoading).toEqual(true);
    await dispatchPromise;
    const newState2 = store.getState();

    expect(newState2.user.orders).toEqual(orderResponse.orders);
    expect(newState2.user.isLoading).toEqual(false);
  });

  test('тест на получение заказов rejected', async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject("popa"));

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(getOrdersApiThunk());
    const newState1 = store.getState();

    expect(newState1.user.isLoading).toEqual(true);

    await dispatchPromise;

    const newState2 = store.getState();

    expect(newState2.user.orders).toEqual([]);
    expect(newState2.user.isLoading).toEqual(false);
  });

  test('тест на отправление данных юзера', async () => {
    const fakeUpdateUserResponse = {
      "success": true,
      "user": {
        "email": "taksa@gmail.com",
        "name": "Зюзя Фиго"
      }
    }

    jest
      .spyOn(global, "fetch")
      .mockImplementation
      (
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(fakeUpdateUserResponse)
          } as Response)
      );

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(updateUserApiThank({}));
    const newState1 = store.getState();

    expect(newState1.user.isLoading).toEqual(true);

    await dispatchPromise;

    const newState2 = store.getState();

    expect(newState2.user.isLoading).toEqual(false);
    expect(newState2.user.user).toEqual(fakeUpdateUserResponse.user);
  });

  test('тест на отправление данных юзера rejected', async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject("popa"));

    const store = configureStore({
      reducer: { user: userReducer }
    });

    const dispatchPromise = store.dispatch(updateUserApiThank({}));

    const newState1 = store.getState();

    expect(newState1.user.isLoading).toEqual(true);

    await dispatchPromise;

    const newState2 = store.getState();

    expect(newState2.user.isLoading).toEqual(false);
    expect(newState2.user.orders).toEqual([]);
  });
})
