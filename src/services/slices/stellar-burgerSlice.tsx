import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '@api';
import {
  TIngredient,
  TOrder,
  TUser,
  TConstructorIngredient,
  TConstructorItems
} from '@utils-types';
import { v4 } from 'uuid';

type TInitialState = {
  ingredients: TIngredient[];
  constructorItems: TConstructorItems;
  user: TUser;
  loading: boolean;
  orders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  totalOrders: number;
  dailyOrders: number;
  userOrders: TOrder[];
  isAutorization: boolean;
  isInit: boolean;
  isModalOpened: boolean;
  error: string;
};

export const initialState: TInitialState = {
  ingredients: [],
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  user: {
    name: '',
    email: ''
  },
  loading: false,
  orders: [],
  orderRequest: false,
  orderModalData: null,
  totalOrders: 0,
  dailyOrders: 0,
  userOrders: [],
  isAutorization: false,
  isInit: false,
  isModalOpened: false,
  error: ''
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);
export const fetchFeeds = createAsyncThunk('user/feed', getFeedsApi);
export const fetchOrders = createAsyncThunk('user/orders', getOrdersApi);
export const fetchOrderBurger = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);
export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);
export const fetchLogin = createAsyncThunk('user/login', loginUserApi);
export const fetchGetUser = createAsyncThunk('user/get', getUserApi);
export const fetchLogout = createAsyncThunk('user/logout', logoutApi);
export const fetchUserUpdate = createAsyncThunk('user/update', updateUserApi);

const stellarBurgerSlice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: v4()
        });
      }
    },
    deleteIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    removeErrorText(state) {
      state.error = '';
    },
    closeOrderRequest(state) {
      (state.orderRequest = false),
        (state.orderModalData = null),
        (state.constructorItems = {
          bun: {
            price: 0
          },
          ingredients: []
        });
    },
    removeOrders(state) {
      state.orders.length = 0;
    },
    init(state) {
      state.isInit = true;
    },
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectConstructorItems: (state) => state.constructorItems,
    selectUser: (state) => state.user,
    selectLoading: (state) => state.loading,
    selectOrders: (state) => state.orders,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectTotalOrders: (state) => state.totalOrders,
    selectDailyOrders: (state) => state.dailyOrders,
    selectUserOrders: (state) => state.userOrders,
    selectIsAutorization: (state) => state.isAutorization,
    selectIsInit: (state) => state.isInit,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.dailyOrders = action.payload.totalToday;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state) => {
        state.loading = false;
        state.isAutorization = true;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message!;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAutorization = true;
      })
      .addCase(fetchGetUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGetUser.rejected, (state) => {
        state.loading = false;
        state.isAutorization = false;
        state.user = { name: '', email: '' };
      })
      .addCase(fetchGetUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAutorization = true;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = {
            name: '',
            email: ''
          };
          state.isAutorization = false;
        }
      })
      .addCase(fetchUserUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserUpdate.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserUpdate.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      });
  }
});

export const {
  selectIngredients,
  selectConstructorItems,
  selectUser,
  selectLoading,
  selectOrderRequest,
  selectOrderModalData,
  selectOrders,
  selectTotalOrders,
  selectDailyOrders,
  selectUserOrders,
  selectIsAutorization,
  selectIsInit,
  selectIsModalOpened,
  selectError
} = stellarBurgerSlice.selectors;

export const {
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setErrorText,
  removeErrorText,
  closeOrderRequest,
  removeOrders,
  init,
  openModal,
  closeModal
} = stellarBurgerSlice.actions;

export default stellarBurgerSlice.reducer;
