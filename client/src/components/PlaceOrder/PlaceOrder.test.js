import React from 'react';
import ReactDOM from 'react-dom';
import PlaceOrder from './PlaceOrder';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlaceOrder />, div);
  ReactDOM.unmountComponentAtNode(div);
});