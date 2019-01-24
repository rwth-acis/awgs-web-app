import {
  GET_ITEMS,
  SAVE_ITEM
} from '../actions/items.js';

const INITIAL_STATE = {
  items: [],
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
    default:
      return state;
  }
};

export default items;
