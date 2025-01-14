import React from 'react';
import ReactDOM from 'react-dom';
import WelcomeNav from './WelcomeNav';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WelcomeNav />, div);
  ReactDOM.unmountComponentAtNode(div);
});