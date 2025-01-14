import React from 'react';
import ReactDOM from 'react-dom';
import WelcomePage from './WelcomePage';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WelcomePage />, div);
  ReactDOM.unmountComponentAtNode(div);
});