import React from 'react';
import ReactDOM from 'react-dom';
import CardUser from './CardUser';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});