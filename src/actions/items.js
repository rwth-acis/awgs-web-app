export const GET_ITEMS = 'GET_ITEMS';
export const FAIL_ITEMS = 'FAIL_ITEMS';
export const SAVE_ITEM = 'SAVE_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const FAIL_ITEM = 'FAIL_ITEM';
export const GET_ITEMTYPES = 'GET_ITEMTYPES';
export const FAIL_ITEMTYPES = 'FAIL_ITEMTYPES';

export const getItems = () => async (dispatch, getState) => {
  const state = getState();
  if (state.app.user === null) {
    return {
      type: FAIL_ITEMS
    };
  }
  const token = state.app.user.access_token;
  fetch('http://localhost:4000/graphql', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + token
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: '{"query":"{items {id, name, owner, description, url, lastupdate, type {id, name}}}"}'
      })
        .then(res => res.json())
        .then(response => {
          const items = response.data.items;
          dispatch({
            type: GET_ITEMS,
            items
          });
        });
};

export const saveItem = (item) => (dispatch, getState) => {
  const state = getState();
  if (state.app.user === null) {
    return {
      type: FAIL_ITEM
    };
  }
  const token = state.app.user.access_token;

  let mutation = `mutation {
    createItem(
      name: "${item.name}"
      description: "${item.description}"
      typeString: "${item.typeString}"
      url: "${item.url}"
    ) {id, name, owner, description, url, lastupdate, type {id, name}}
  }`;
  let payload = JSON.stringify({'operationName':null,'variables':{},'query':mutation});

  fetch('http://localhost:4000/graphql', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Bearer " + token
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: payload
    })
      .then(res => res.json())
      .then(response => {
        if (response.data === null) {
          // there is an error
          return {
            type: FAIL_ITEM
          };
        }
        const item = response.data.createItem;
        dispatch({
          type: SAVE_ITEM,
          item
        });
      });
};

export const updateItem = (item) => (dispatch, getState) => {
  const state = getState();
  
  if (state.app.user === null) {
    return {
      type: FAIL_ITEM
    };
  }
  const token = state.app.user.access_token;

  let mutation = `mutation {
    updateItem(
      id: "${item.id}"
      name: "${item.name}"
      description: "${item.description}"
      typeString: "${item.typeString}"
      url: "${item.url}"
    ) {id, name, owner, description, url, lastupdate, type {id, name}}
  }`;
  let payload = JSON.stringify({'operationName':null,'variables':{},'query':mutation});

  fetch('http://localhost:4000/graphql', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Bearer " + token
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: payload
    })
      .then(res => res.json())
      .then(response => {
        if (response.data === null) {
          // there is an error
          return {
            type: FAIL_ITEM
          };
        }
        const item = response.data.updateItem;
    
        dispatch({
          type: UPDATE_ITEM,
          item
        });
      });
};

export const getItemTypes = () => async (dispatch, getState) => {
  const state = getState();
  if (state.app.user === null) {
    return {
      type: FAIL_ITEMTYPES
    };
  }
  const token = state.app.user.access_token;
  fetch('http://localhost:4000/graphql', {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Bearer " + token
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: '{"query":"{itemtypes {id, name}}"}'
      })
        .then(res => res.json())
        .then(response => {
          const itemtypes = response.data.itemtypes;
          dispatch({
            type: GET_ITEMTYPES,
            itemtypes
          });
        });
};
