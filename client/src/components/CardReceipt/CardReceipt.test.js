import React from 'react';
import ReactDOM from 'react-dom';
import CardReceipt from './CardReceipt';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardReceipt />, div);
  ReactDOM.unmountComponentAtNode(div);
});