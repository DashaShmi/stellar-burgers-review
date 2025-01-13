import { FC, useEffect } from 'react';

import { getOrders } from '@selectors';
import { useAppDispatch, useAppSelector } from '@store';
import { ProfileOrdersUI } from '@ui-pages';
import { getIngredientsApiThunk, getOrdersApiThunk } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  let orders = useAppSelector(getOrders);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getOrdersApiThunk());
      dispatch(getIngredientsApiThunk());
    }
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
