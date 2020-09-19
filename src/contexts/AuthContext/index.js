import { contextFactory } from '../../config/context';

import { INITIAL_STATE } from './reducer';

export const { useSelector, Context, useDispatch } = contextFactory(
  INITIAL_STATE
);
