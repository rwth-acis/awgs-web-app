/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class ViewStatistics extends connect(store)(PageViewElement) {
  render() {
    return html`
      ${SharedStyles}
      <section>
        <h2>Statistics</h2>
        <p>There are no statistics yet, just unfulfilled wishes. This needs to be solved with SWEVA.</p>
      </section>
    `;
  }

  static get properties() { return {
    // This is the data from the store.
    _clicks: { type: Number },
    _value: { type: Number },
  }}

  // This is called every time something is updated in the store.
  stateChanged(state) {
  }
}

window.customElements.define('view-statistics', ViewStatistics);
