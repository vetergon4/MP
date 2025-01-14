import React from 'react';
import ReactDOM from 'react-dom';
import CardBuoysHome from './CardBuoysHome';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardBuoysHome />, div);
  ReactDOM.unmountComponentAtNode(div);
});