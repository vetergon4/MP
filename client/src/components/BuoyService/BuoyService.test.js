import React from 'react';
import ReactDOM from 'react-dom';
import BuoyService from './BuoyService';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BuoyService />, div);
  ReactDOM.unmountComponentAtNode(div);
});