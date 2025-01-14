import React from 'react';
import ReactDOM from 'react-dom';
import NavbarAdmin from './NavbarAdmin';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavbarAdmin />, div);
  ReactDOM.unmountComponentAtNode(div);
});