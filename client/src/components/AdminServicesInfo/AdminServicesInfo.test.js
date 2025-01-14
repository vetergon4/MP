import React from 'react';
import ReactDOM from 'react-dom';
import AdminServicesInfo from './AdminServicesInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminServicesInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});