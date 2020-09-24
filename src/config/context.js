import { createContext, useContext } from 'react';

export const contextFactory = initialState => {
  const Context = createContext({
    state: { ...initialState },
    dispatch: () => {},
  });

  const useSelector = selector => {
    const { state } = useContext(Context);
    return selector(state);
  };

  const useDispatch = () => {
    const { dispatch } = useContext(Context);
    return dispatch;
  };

  return { useSelector, Context, useDispatch };
};
