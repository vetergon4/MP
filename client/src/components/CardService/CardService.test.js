import React from 'react';
import ReactDOM from 'react-dom';
import CardService from './CardService';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardService />, div);
  ReactDOM.unmountComponentAtNode(div);
});