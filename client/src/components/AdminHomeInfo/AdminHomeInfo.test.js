import React from 'react';
import ReactDOM from 'react-dom';
import AdminHomeInfo from './AdminHomeInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminHomeInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});