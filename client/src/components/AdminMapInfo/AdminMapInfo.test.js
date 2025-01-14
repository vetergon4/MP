import React from 'react';
import ReactDOM from 'react-dom';
import AdminMapInfo from './AdminMapInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminMapInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});