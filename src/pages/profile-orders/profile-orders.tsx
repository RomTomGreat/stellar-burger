import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchIngredients,
  fetchOrders,
  removeUserOrders,
  selectUserOrders
} from '../../services/slices/stellar-burgerSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useAppSelector(selectUserOrders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeUserOrders());
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchOrders())]);
  }, []);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
