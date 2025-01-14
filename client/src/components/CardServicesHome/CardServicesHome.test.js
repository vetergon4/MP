import React from 'react';
import ReactDOM from 'react-dom';
import CardServicesHome from './CardServicesHome';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardServicesHome />, div);
  ReactDOM.unmountComponentAtNode(div);
});