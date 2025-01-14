import React from 'react';
import ReactDOM from 'react-dom';
import RevenueGraph from './RevenueGraph';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RevenueGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});