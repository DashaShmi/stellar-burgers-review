import { FC } from 'react';

import { FeedInfoUI } from '@ui';
import { getFeed } from '@selectors';
import { TOrder } from '@utils-types';
import { useAppSelector } from '@store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feed = useAppSelector(getFeed);

  const readyOrders = getOrders(feed.orders, 'done');

  const pendingOrders = getOrders(feed.orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
