import React from 'react';
import ReactDOM from 'react-dom';
import CardBuoy from './CardBuoy';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardBuoy />, div);
  ReactDOM.unmountComponentAtNode(div);
});