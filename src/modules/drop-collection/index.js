import { combineReducers } from 'redux';
import isRunning, {
  toggleIsRunning,
  INITIAL_STATE as IS_RUNNING_INITIAL_STATE
} from 'modules/is-running';
import isVisible, {
  INITIAL_STATE as IS_VISIBLE_INITIAL_STATE
} from 'modules/is-visible';
import name, {
  INITIAL_STATE as NAME_INITIAL_STATE
} from 'modules/drop-collection/name';
import nameConfirmation, {
  INITIAL_STATE as NAME_CONFIRMATION_INITIAL_STATE
} from 'modules/drop-collection/name-confirmation';
import error, {
  clearError, handleError, INITIAL_STATE as ERROR_INITIAL_STATE
} from 'modules/error';
import { reset, RESET } from 'modules/reset';
import dataService from 'modules/data-service';

/**
 * The main reducer.
 */
const reducer = combineReducers({
  isRunning,
  isVisible,
  name,
  nameConfirmation,
  error,
  dataService
});

/**
 * The root reducer.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const rootReducer = (state, action) => {
  if (action.type === RESET) {
    return {
      ...state,
      isRunning: IS_RUNNING_INITIAL_STATE,
      isVisible: IS_VISIBLE_INITIAL_STATE,
      name: NAME_INITIAL_STATE,
      nameConfirmation: NAME_CONFIRMATION_INITIAL_STATE,
      error: ERROR_INITIAL_STATE
    };
  }
  return reducer(state, action);
};

export default rootReducer;

/**
 * Stop progress and set the error.
 *
 * @param {Function} dispatch - The dispatch function.
 * @param {Error} err - The error.
 *
 * @return {Object} The result.
 */
const stopWithError = (dispatch, err) => {
  dispatch(toggleIsRunning(false));
  return dispatch(handleError(err));
};

/**
 * The drop collection action.
 *
 * @returns {Function} The thunk function.
 */
export const dropCollection = () => {
  return (dispatch, getState) => {
    const state = getState();
    const ds = state.dataService.dataService;
    const dbName = state.name;

    dispatch(clearError());

    try {
      dispatch(toggleIsRunning(true));
      ds.dropCollection(dbName, (e) => {
        if (e) {
          return stopWithError(dispatch, e);
        }
        global.hadronApp.appRegistry.getAction('App.InstanceActions').refreshInstance();
        dispatch(reset());
      });
    } catch (e) {
      return stopWithError(dispatch, e);
    }
  };
};