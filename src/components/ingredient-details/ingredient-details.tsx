import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@store';
import { getIngredients } from '@selectors';
import { getIngredientsApiThunk } from '@slices';
import { IngredientDetailsUI, Preloader } from '@ui';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const ingredients = useAppSelector(getIngredients);

  const ingredientData = ingredients.find((x) => x._id === id);

  useEffect(() => {
    if (ingredients.length > 0) {
      return;
    }
    dispatch(getIngredientsApiThunk());
  }, [ingredients]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
