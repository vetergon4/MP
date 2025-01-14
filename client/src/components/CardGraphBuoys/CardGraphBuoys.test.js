import React from 'react';
import ReactDOM from 'react-dom';
import CardGraphBuoys from './CardGraphBuoys';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardGraphBuoys />, div);
  ReactDOM.unmountComponentAtNode(div);
});