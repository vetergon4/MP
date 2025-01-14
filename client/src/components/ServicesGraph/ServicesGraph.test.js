import React from 'react';
import ReactDOM from 'react-dom';
import ServicesGraph from './ServicesGraph';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ServicesGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});