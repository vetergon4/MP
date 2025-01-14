import React from 'react';
import ReactDOM from 'react-dom';
import Registration from './Registration';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Registration />, div);
  ReactDOM.unmountComponentAtNode(div);
});