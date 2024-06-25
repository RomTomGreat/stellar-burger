import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchOrders,
  selectUserOrders
} from '../../services/slices/stellar-burgerSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const orders: TOrder[] = useAppSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
