import { setAccessToken } from '../../services/CTUserAPIService';
import { setInfected } from '../../services/LocalStorageService';

export const INITIAL_STATE = {
  session: null,
  infected: false,
};

export const actionCreators = {
  setSession: session => ({ type: 'SET_SESSION', payload: session }),
  resetSession: () => ({ type: 'RESET_SESSION' }),
  setInfected: infected => ({ type: 'SET_INFECTED', payload: infected }),
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
    case 'SET_INFECTED': {
      setInfected(action.payload);
      return { ...state, infected: action.payload };
    }
    default: {
      return state;
    }
  }
};
