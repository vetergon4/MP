import React from 'react';
import ReactDOM from 'react-dom';
import AdminPaymentsInfo from './AdminPaymentsInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminPaymentsInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});