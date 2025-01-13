import { FC, SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { TRegisterData } from '@api';
import { getUser } from '@selectors';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '@store';
import { registerUserApiThunk } from '@slices';

export const Register: FC = () => {
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const registerData: TRegisterData = {
      email: email,
      name: userName,
      password: password
    };

    dispatch(registerUserApiThunk(registerData));
  };

  const user = useAppSelector(getUser);

  if (user !== null) {
    return <Navigate to={'/profile'} />;
  }

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
