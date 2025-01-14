import React from 'react';
import ReactDOM from 'react-dom';
import AdminBuoysInfo from './AdminBuoysInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminBuoysInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});