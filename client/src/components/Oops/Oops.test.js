import React from 'react';
import ReactDOM from 'react-dom';
import Oops from './Oops';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Oops />, div);
  ReactDOM.unmountComponentAtNode(div);
});