import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeeds,
  fetchIngredients,
  removeOrders,
  selectOrders
} from '../../services/slices/stellar-burgerSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useAppSelector(selectOrders);

  useEffect(() => {
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchFeeds())]);
  });

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(removeOrders());
        dispatch(fetchFeeds());
      }}
    />
  );
};
