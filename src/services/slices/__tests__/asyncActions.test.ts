import stellarBurgerSlice, {
  fetchFeeds,
  fetchIngredients,
  fetchLogin,
  fetchLogout,
  fetchOrderBurger,
  fetchRegisterUser,
  fetchUserUpdate,
  fetchOrders,
  fetchGetUser,
  initialState
} from '../stellar-burgerSlice';

describe('Тестирую асинхронные экшены', () => {
  test('Тестирую получения юзера, pending', () => {
    const state = stellarBurgerSlice(initialState, fetchGetUser.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тестирую получения юзера, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchGetUser.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
    expect(state.isAutorization).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
  });

  test('Тестирую получения юзера, fulfilled', () => {
    const mockResponse = {
      success: true,
      user: { name: 'user', email: 'user@mail.ru' }
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchGetUser.fulfilled(mockResponse, '')
    );

    expect(state.user).toEqual(mockResponse.user);
  });

  test('Тестирую получение ингридиентов, pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.pending('')
    );

    expect(state.loading).toBe(true);
  });

  test('Тестирую получение ингридиентов, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тестирую получение ингридиентов, fulfilled', () => {
    const mockResponse = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.fulfilled(mockResponse, '')
    );

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockResponse);
  });

  test('Тестирую запрос на создание заказа, pending', () => {
    const mockOrder = ['testid1', 'testid2', 'testid3'];
    const state = stellarBurgerSlice(
      initialState,
      fetchOrderBurger.pending('', mockOrder)
    );

    expect(state.orderRequest).toBe(true);
  });

  test('Тестирую запрос на создание заказа, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchOrderBurger.rejected(mockAnswer, '', [''])
    );

    expect(state.orderRequest).toBe(false);
  });

  test('Тестирую запрос на создание заказа, fulfilled', () => {
    const mockResponse = {
      success: true,
      name: 'testname',
      order: {
        _id: '664e927097ede0001d06bdb9',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2024-05-23T00:48:48.039Z',
        updatedAt: '2024-05-23T00:48:48.410Z',
        number: 40680
      }
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchOrderBurger.fulfilled(mockResponse, '', [''])
    );

    expect(state.orderModalData).toEqual(mockResponse.order);
    expect(state.orderRequest).toBe(false);
  });

  test('Тестирую вход в аккаунт юзера, pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchLogin.pending('', { email: 'test@mail.ru', password: 'test' })
    );

    expect(state.loading).toBe(true);
  });

  test('Тестирую вход в аккаунт юзера, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchLogin.rejected(mockAnswer, '', {
        email: 'test@mail.ru',
        password: 'test'
      })
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('error');
  });

  test('Тестирую вход в аккаунт юзера, fulfilled', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchLogin.fulfilled(
        {
          success: true,
          refreshToken: 'testtoken',
          accessToken: 'testaccess',
          user: { name: 'testuser', email: 'testuser@mail.ru' }
        },
        '',
        { password: 'testuser', email: 'testuser@mail.ru' }
      )
    );

    expect(state.loading).toBe(false);
    expect(state.isAutorization).toBe(true);
  });

  test('Тестирую регистрацию юзера на сайте, pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.pending(
        '',
        { name: 'user', email: 'test@mail.ru', password: 'test' },
        ''
      )
    );

    expect(state.loading).toBe(true);
  });

  test('Тестирую регистрацию юзера на сайте, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.rejected(mockAnswer, '', {
        name: 'user',
        email: 'test@mail.ru',
        password: 'test'
      })
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('error');
  });

  test('Тестирую регистрацию юзера на сайте, fulfilled', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.fulfilled(
        {
          success: true,
          refreshToken: 'testtoken',
          accessToken: 'testaccess',
          user: { name: 'testuser', email: 'testuser@mail.ru' }
        },
        '',
        { name: 'user', password: 'testuser', email: 'testuser@mail.ru' }
      )
    );

    expect(state.isAutorization).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('Тестирую ленту заказов, pending', () => {
    const state = stellarBurgerSlice(initialState, fetchFeeds.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тестирую ленту заказов, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchFeeds.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тестирую ленту заказов, fulfilled', () => {
    const mockResponse = {
      success: true,
      total: 100,
      totalToday: 10,
      orders: [
        {
          _id: '664e927097ede0001d06bdb9',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2024-05-23T00:48:48.039Z',
          updatedAt: '2024-05-23T00:48:48.410Z',
          number: 40680
        }
      ]
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchFeeds.fulfilled(mockResponse, '')
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.totalOrders).toEqual(mockResponse.total);
    expect(state.dailyOrders).toEqual(mockResponse.totalToday);
  });

  test('Тестирую отображение истории заказов у юзера, pending', () => {
    const state = stellarBurgerSlice(initialState, fetchOrders.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тестирую отображение истории заказов у юзера, rejected', () => {
    const mockAnswer = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchOrders.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тестирую отображение истории заказов у юзера, fulfilled', () => {
    const mockResponse = [
      {
        _id: '664e927097ede0001d06bdb9',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2024-05-23T00:48:48.039Z',
        updatedAt: '2024-05-23T00:48:48.410Z',
        number: 40680
      }
    ];
    const state = stellarBurgerSlice(
      initialState,
      fetchOrders.fulfilled(mockResponse, '')
    );

    expect(state.loading).toBe(false);
    expect(state.userOrders).toEqual(mockResponse);
  });

  test('Тестирую выход из аккаунта юзера, pending', () => {
    const state = stellarBurgerSlice(initialState, fetchLogout.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тестирую выход из аккаунта юзера, rejected', () => {
    const mockError = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchLogout.rejected(mockError, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тестирую выход из аккаунта юзера, fulfilled', () => {
    const mockAnswer = { success: true };
    const state = stellarBurgerSlice(
      initialState,
      fetchLogout.fulfilled(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.isAutorization).toBe(false);
  });

  test('Тестирую обновление профиля юзера, pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchUserUpdate.pending('', { name: 'test' })
    );
    expect(state.loading).toBe(true);
  });

  test('Тестирую обновление профиля юзера rejected', () => {
    const mockError = { name: 'test', message: 'error' };
    const state = stellarBurgerSlice(
      initialState,
      fetchUserUpdate.rejected(mockError, '', { name: 'test' })
    );
    expect(state.loading).toBe(false);
  });

  test('Тестирую обновление профиля юзера fulfilled', () => {
    const mockUser = { name: 'testuser', email: 'changedEmail@mail.ru' };
    const mockResponse = {
      success: true,
      user: mockUser
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchUserUpdate.fulfilled(mockResponse, '', mockUser)
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });
});
