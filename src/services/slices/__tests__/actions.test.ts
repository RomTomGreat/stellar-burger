import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  addIngredient,
  deleteIngredient,
  moveIngredientDown,
  moveIngredientUp,
  selectConstructorItems
} from '../stellar-burgerSlice';
import { mockIngredient, mockBun } from '../mockData';

function initStore() {
  return configureStore({
    reducer: {
      stellarBurger: stellarBurgerSlice
    }
  });
}

describe('Тестирую экшены', () => {
  test('Проверка добавления ингридиента', () => {
    const store = initStore();
    store.dispatch(addIngredient(mockIngredient));
    store.dispatch(addIngredient(mockBun));

    const constructor = selectConstructorItems(store.getState());
    expect(constructor.ingredients.length).toEqual(1);
    expect(constructor.bun.name === 'Краторная булка N-200i');
  });

  test('Проверка удаления ингридиента', () => {
    const store = initStore();
    store.dispatch(addIngredient(mockIngredient));
    const before = selectConstructorItems(store.getState()).ingredients.length;
    store.dispatch(deleteIngredient(mockIngredient));
    const after = selectConstructorItems(store.getState()).ingredients.length;
    expect(before).toBe(1);
    expect(after).toBe(1);
  });

  test('Тестирую перемещение ингридиентов вверх', () => {
    const store = initStore();
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const lastIngredient = ingredients[ingredients.length - 1];

    store.dispatch(moveIngredientUp(lastIngredient));

    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[ingredients.length - 2]).toEqual(lastIngredient);
  });

  test('Тестирую перемещение ингридиентов вниз', () => {
    const store = initStore();
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const firstIngredient = ingredients[0];

    store.dispatch(moveIngredientDown(firstIngredient));

    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[1]).toEqual(firstIngredient);
  });
});
