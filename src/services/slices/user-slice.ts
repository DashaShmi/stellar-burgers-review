import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export const registerUserApiThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const authData = await registerUserApi(data);
    setCookie('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    return authData;
  }
);

export const getUserApiThunk = createAsyncThunk('user/get', getUserApi);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const loginUserData = await loginUserApi(data);
    setCookie('accessToken', loginUserData.accessToken);
    localStorage.setItem('refreshToken', loginUserData.refreshToken);
    return loginUserData;
  }
);

export const updateUserApiThank = createAsyncThunk(
  'user/update',
  updateUserApi
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear(); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
        dispatch(userLogout()); // удаляем пользователя из хранилища
      })
      .catch((e) => {
        console.error('Ошибка выполнения выхода', e);
      });
  }
);

export const checkUserAuthThunk = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      console.log(`куки найден: ${getCookie('accessToken')}`);
      try {
        await dispatch(getUserApiThunk());
      } catch (error) {
        //  если случилась ошибка
        console.error(error);
      } finally {
        dispatch(authChecked());
      }
    } else {
      console.log(`куки не найден: ${getCookie('accessToken')}`);
      dispatch(authChecked());
    }
  }
);

export const getOrdersApiThunk = createAsyncThunk('orders', getOrdersApi);

export interface userState {
  isLoading: boolean;
  user: TUser | null;
  isAuthChecked: boolean;
  orders: TOrder[];
}
export const initialUserState: userState = {
  isLoading: false,
  user: null,
  isAuthChecked: false,
  orders: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    //registerUser
    builder.addCase(registerUserApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUserApiThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    //getUserApi
    builder.addCase(getUserApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserApiThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    //login
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    //getOrders
    builder.addCase(getOrdersApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrdersApiThunk.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getOrdersApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    // updateUser
    builder.addCase(updateUserApiThank.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserApiThank.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateUserApiThank.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
  }
});

export const { userLogout, authChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
