import React from 'react';
import ReactDOM from 'react-dom';
import HourlyForecast from './HourlyForecast';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HourlyForecast />, div);
  ReactDOM.unmountComponentAtNode(div);
});