import { FC, useEffect } from 'react';

import { AppHeaderUI } from '@ui';
import { useAppDispatch, useAppSelector } from '@store';
import { checkUserAuthThunk } from '@slices';
import { getIsAuthChecked, getUser } from '@selectors';

export const AppHeader: FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(getUser);
  const isAuthChecked = useAppSelector(getIsAuthChecked);

  useEffect(() => {
    if (isAuthChecked) {
      return;
    }

    dispatch(checkUserAuthThunk());
  }, [isAuthChecked]);

  return <AppHeaderUI userName={user?.name} />;
};
