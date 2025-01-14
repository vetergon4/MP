import React from 'react';
import ReactDOM from 'react-dom';
import CardServiceUser from './CardServiceUser';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardServiceUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});