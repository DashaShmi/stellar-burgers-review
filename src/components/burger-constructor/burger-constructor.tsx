import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  getConstructorItems,
  getOrderModalData,
  getOrderRequest,
  getUser
} from '@selectors';
import { BurgerConstructorUI } from '@ui';
import { useAppDispatch, useAppSelector } from '@store';
import { closeOrderModal, orderBurgerApiThunk } from '@slices';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(getUser);
  const orderRequest = useAppSelector(getOrderRequest);
  const orderModalData = useAppSelector(getOrderModalData);
  const constructorItems = useAppSelector(getConstructorItems);

  const onOrderClick = () => {
    if (constructorItems.bun === null || orderRequest) {
      return;
    }

    if (user === null) {
      // если пользователя в хранилище нет, то делаем редирект

      debugger;

      navigate('/login', { state: { lastPath: location } }); // Перенаправляем на дефолтный маршрут
      return;
    }

    const idsIngr: string[] = [];

    idsIngr.push(constructorItems.bun._id);

    idsIngr.push(...constructorItems.ingredients.map((x) => x._id));

    idsIngr.push(constructorItems.bun._id);

    dispatch(orderBurgerApiThunk(idsIngr));
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
