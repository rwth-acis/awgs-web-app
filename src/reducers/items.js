import {
  GET_ITEMS,
  SAVE_ITEM,
  GET_ITEMTYPES
} from '../actions/items.js';

const INITIAL_STATE = {
  items: [],
  itemtypes: [],
  error: ''
};

const items = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.items
      };
    case SAVE_ITEM:
      return {
        ...state,
        items: [
          ...state.items,
          action.item
        ]
      };
    case GET_ITEMTYPES:
      return {
        ...state,
        itemtypes: action.itemtypes
      };
    default:
      return state;
  }
};

export default items;
