/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {html} from 'lit-element';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {PageViewElement} from './page-view-element.js';

// This element is connected to the Redux store.
import {store} from '../store.js';

// These are the actions needed by this element.
import {getItems, saveItem, getItemTypes} from '../actions/items.js';

// We are lazy loading its reducer.
import items from '../reducers/items.js';
store.addReducers({
  items
});

import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js'
import '@vaadin/vaadin-button/vaadin-button.js';
import '@vaadin/vaadin-form-layout/vaadin-form-layout.js';
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import '@vaadin/vaadin-text-field/vaadin-text-area.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '@vaadin/vaadin-checkbox/vaadin-checkbox.js';
import {hourGlass} from './my-icons.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class ViewItems extends connect(store)(PageViewElement) {

  constructor() {
    super();

    // Initialize properties
    this._nextId = 'not available';
  }

  render() {
    return html`
      ${SharedStyles}
      <style>
        #button-open-form {
          display: block;
        }

        .form {
          box-sizing: border-box;
          border: 1px solid var(--app-secondary-color);
          border-radius: 5px;
          padding: 10px;
          display: none;
        }

        svg {
          fill: var(--app-light-text-color);
        }

        vaadin-grid {
          max-width: 100%;
          width: 100%;
        }
      </style>
      <section>
        <!--<h2>Items</h2>-->
        <p>A service for managing the ACIS Working Group Series, a series of working papers created by members of the ACIS working group at Chair of Computer Science 5 - Databases & Information Systems, RWTH Aachen University, Germany.</p>
        <p>
          <vaadin-button id="button-open-form" theme="primary" @click="${this._handleOpenFormClick}">Register a new AWGS ID</vaadin-button>
        </p>
        <p>
          <div class="form">
            <h3>Register a new AWGS ID</h3>
            <vaadin-form-layout>
              <vaadin-text-field label="AWGS ID (preliminary)" value=${this._nextId} readonly></vaadin-text-field>
              <vaadin-combo-box id="register-form-type" label="Type" .dataProvider=${this._provideDataType.bind(this)}></vaadin-combo-box>
              <vaadin-text-field id="register-form-name" label="Name"></vaadin-text-field>
              <vaadin-text-area id="register-form-description" label="Description"></vaadin-text-area>
              <vaadin-text-field id="register-form-url" label="URL (BSCW or similar)"
                                 pattern="(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"></vaadin-text-field>
              <span>
                <vaadin-button id="button-register"theme="primary" @click="${this._handleRegisterClick}">
                  Register
                </vaadin-button>
                <vaadin-button id="button-cancel" @click="${this._handleCancelClick}">Cancel</vaadin-button>
              </span>
            </vaadin-form-layout>
          </div>
        </p>
      </section>
      <section>
        <vaadin-grid height-by-rows .items=${this._items}>
          <vaadin-grid-sort-column path="id" direction="desc" header="ID" width="150px" flex-grow="0"></vaadin-grid-sort-column>
          <vaadin-grid-column path="name" header="Name"></vaadin-grid-column>
          <vaadin-grid-filter-column path="owner" header="Owner" width="100px" flex-grow="0"></vaadin-grid-filter-column>
          <vaadin-grid-sort-column path="lastupdate" header="Last Update"width="200px" flex-grow="0"></vaadin-grid-sort-column>
          <!--<vaadin-grid-column .renderer=${this._renderDetails}></vaadin-grid-column>-->
        </vaadin-grid>
      </section>
    `;
  }

  static get properties() {
    return {
      _items: {type: Array},
      _itemtypes: {type: Array},
      _nextId: {type: String}
    }
  }

  firstUpdated(changedProperties) {
    /*
    const grid = this.shadowRoot.querySelector('vaadin-grid');
    grid.rowDetailsRenderer = function(root, grid, rowData) {
      if (!root.firstElementChild) {
        root.innerHTML =
        '<div class="details">' +
        '<p><span></span><br>' +
        '</div>';
      }
      root.firstElementChild.querySelector('span').textContent = rowData.item.name;
    };
    */
  }

   // This is called every time something is updated in the store.
  stateChanged(state) {
    if (state.app.user && (state.items.items.length === 0)) {
      //TODO: use wait-for-redux or something similar for automatically dispatching once we're signed in
      store.dispatch(getItems());
      store.dispatch(getItemTypes());
    }
    if (state.items.items.length > 0) {
      this._items = state.items.items.map(item => {
        // strip owner name
        item.owner = item.owner.split('@')[0];
        // format date
        const date = new Date(parseInt(item.lastupdate));
        item.lastupdate = date.toLocaleString();
        return item;
      });
      
      const [latestItem] = this._items.slice(-1);
      const lastIdSplit = latestItem.id.split('-');
      const currentYear = (new Date()).getFullYear();
      let newId = 'AWGS-' + currentYear + '-';
      if (lastIdSplit[1] == currentYear) {
        newId += (parseInt(lastIdSplit[2]) + 1).toString().padStart(3, '0');
      } else {
        // happy new year!
        newId += '001';
      }
      this._nextId = newId;

      // in case we just sent an item to the server reset the form
      //TODO: only reset after saving item
      this._resetForm();
    }
    if (state.items.itemtypes.length > 0) {
      this._itemtypes = state.items.itemtypes;
    }
  }

  _renderDetails(root, column, rowData) {
    /*
    if (!root.firstElementChild) {
      root.innerHTML = `<vaadin-checkbox>Details</vaadin-checkbox>`;
      root.firstElementChild.addEventListener('checked-changed', function(e) {
        if (e.detail.value) {
          grid.openItemDetails(root.item);
        } else {
          grid.closeItemDetails(root.item);
        }
      });
    }
    //root.item = rowData.item;
    //root.firstElementChild.checked = grid.detailsOpenedItems.indexOf(root.item) > -1;
    */
  };

  _handleOpenFormClick(e) {
    this.shadowRoot.querySelector('.form').style.display = 'block';
    this.shadowRoot.querySelector('#button-open-form').style.display = 'none';
  }

  _handleRegisterClick(e) {
    let item = {};
    // escape all double-quote chars in a string if it's not already escaped
    item.typeString = this.shadowRoot.getElementById('register-form-type').value.replace(/\\([\s\S])|(")/g,"\\$1$2");
    item.name = this.shadowRoot.getElementById('register-form-name').value.replace(/\\([\s\S])|(")/g,"\\$1$2");
    item.description = this.shadowRoot.getElementById('register-form-description').value.replace(/\\([\s\S])|(")/g,"\\$1$2");
    item.url = this.shadowRoot.getElementById('register-form-url').value.replace(/\\([\s\S])|(")/g,"\\$1$2");

    store.dispatch(saveItem(item));
  }

  _handleCancelClick(e) {
    this._resetForm();
  }

  _resetForm() {
    this.shadowRoot.querySelector('.form').style.display = 'none';
    this.shadowRoot.querySelector('#button-open-form').style.display = 'block';

    // reset form fields
    this.shadowRoot.getElementById('register-form-type').value = '';
    this.shadowRoot.getElementById('register-form-name').value = '';
    this.shadowRoot.getElementById('register-form-description').value = '';
    this.shadowRoot.getElementById('register-form-url').value = '';
  }

  _provideDataType(params, callback) {
    if (this._itemtypes) {
      let itemtypesSorted = this._itemtypes.map(itemtype => itemtype.name).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
      let itemtypesFiltered = itemtypesSorted.filter(item => item.toLowerCase().includes(params.filter.toLowerCase()));
      callback(itemtypesFiltered, itemtypesFiltered.length);
      return true;
    }
  }

}

window.customElements.define('view-items', ViewItems);
