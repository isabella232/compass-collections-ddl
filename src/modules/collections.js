import zipObject from 'lodash.zipobject';
import sortByOrder from 'lodash.sortbyorder';
import { INITIAL_STATE as COLUMNS } from 'modules/columns';

/**
 * The module prefix.
 */
const PREFIX = 'ddl/collections';

/**
 * The sort collections action name.
 */
export const SORT_COLLECTIONS = `${PREFIX}/SORT_COLLECTIONS`;

/**
 * The load collections action name.
 */
export const LOAD_COLLECTIONS = `${PREFIX}/LOAD_COLLECTIONS`;

/**
 * Default column.
 */
const NAME = 'Collection Name';

/**
 * Default sort.
 */
const ASC = 'asc';

/**
 * The initial state of the collections attribute.
 */
export const INITIAL_STATE = [];

/**
 * Reducer function for handle state changes to collections.
 *
 * @param {Array} state - The collections state.
 * @param {Object} action - The action.
 *
 * @returns {Array} The new state.
 */
export default function reducer(state = INITIAL_STATE, action) {
  if (action.type === SORT_COLLECTIONS) {
    return sort(action.collections, action.column, action.order);
  } else if (action.type === LOAD_COLLECTIONS) {
    return load(action.collections);
  }
  return state;
}

/**
 * Sort the collection list by column and order.
 *
 * @param {Array} collections - The unsorted collection list.
 * @param {String} column - The column to sort by.
 * @param {String} order - The order to sort by.
 *
 * @returns {Array} The sorted list.
 */
const sort = (collections, column, order) => {
  return sortByOrder(collections, column || NAME, order || ASC);
};

/**
 * Load collections to the UI friendly form.
 *
 * @param {Array} collections - The collections info.
 *
 * @return {Array} The mapped collections for the UI.
 */
export const load = (collections) => {
  return collections.map((db) => {
    return zipObject(COLUMNS, [
      db._id, db.storage_size, db.collections.length, db.index_count
    ]);
  });
};

/**
 * Action creator for load collections events.
 *
 * @param {Array} collections - The raw collection list.
 *
 * @returns {Object} The load collections action.
 */
export const loadCollections = (collections) => ({
  type: LOAD_COLLECTIONS,
  collections: collections
});

/**
 * Action creator for sort collections events.
 *
 * @param {Array} collections - The unsorted collection list.
 * @param {String} column - The column.
 * @param {String} order - The order.
 *
 * @returns {Object} The sort collections action.
 */
export const sortCollections = (collections, column, order) => ({
  type: SORT_COLLECTIONS,
  collections: collections,
  column: column,
  order: order
});