import React from 'react';
import ReactDOM from 'react-dom';
import AdminReceiptsInfo from './AdminReceiptsInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminReceiptsInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});