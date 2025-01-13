import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { getIsAuthChecked, getUser } from '@selectors';
import { useAppSelector } from '@store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useAppSelector(getUser);
  const isAuthChecked = useAppSelector(getIsAuthChecked);
  const location = useLocation();
  const lastPath: Location | undefined = location.state?.lastPath;

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    // если пользователь на странице авторизации и данные есть в хранилище
    return <Navigate replace to={lastPath ?? '/profile'} />;
  }

  return children;
};
