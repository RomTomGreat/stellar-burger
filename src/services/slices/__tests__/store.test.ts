import { combineReducers, configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice from '../stellar-burgerSlice';

describe('Тестирую корневой редьюсер', () => {
  it('проверяю правильность настройки и работу rootReducer', () => {
    const rootReducer = combineReducers({
      stellarBurger: stellarBurgerSlice
    });

    const store = configureStore({
      reducer: rootReducer
    });

    expect(store.getState()).toEqual(
      rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );
  });
});
