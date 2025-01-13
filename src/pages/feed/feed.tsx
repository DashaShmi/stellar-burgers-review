import { FC } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { getFeed } from '@selectors';
import { useAppDispatch, useAppSelector } from '@store';
import { getFeedsApiThunk, getIngredientsApiThunk } from '@slices';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();

  const { orders } = useAppSelector(getFeed);

  if (orders.length === 0) {
    dispatch(getFeedsApiThunk());
    dispatch(getIngredientsApiThunk());
  }

  if (!orders.length) {
    return <Preloader />;
  }

  const getFeedsHandle = () => {
    dispatch(getFeedsApiThunk());
  };

  return <FeedUI orders={orders} handleGetFeeds={getFeedsHandle} />;
};
