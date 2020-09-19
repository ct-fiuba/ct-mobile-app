import React, { useReducer } from 'react';

import {
  reducer as authReducer,
  INITIAL_STATE,
} from './src/contexts/AuthContext/reducer';

import { Context } from './src/contexts/AuthContext';

import Screens from './src/screens';

export default function App() {
  const [authState, authDispatch] = useReducer(authReducer, INITIAL_STATE);
  return (
    <Context.Provider value={{ state: authState, dispatch: authDispatch }}>
      <Screens />
    </Context.Provider>
  );
}
