import { FC, SyntheticEvent, useState } from 'react';

import { TLoginData } from '@api';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '@store';
import { loginUserThunk } from '@slices';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const loginData: TLoginData = {
      email: email,
      password: password
    };

    dispatch(loginUserThunk(loginData));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
