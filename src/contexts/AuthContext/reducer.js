import { setAccessToken } from '../../services/CTUserAPIService';

export const INITIAL_STATE = {
  session: null,
};

export const actionCreators = {
  setSession: session => ({ type: 'SET_SESSION', payload: session }),
  resetSession: () => ({ type: 'RESET_SESSION' }),
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SESSION': {
      setAccessToken(action.payload.accessToken);
      return { ...state, session: action.payload };
    }
    case 'RESET_SESSION': {
      return { ...state, session: null };
    }
    default: {
      return state;
    }
  }
};
