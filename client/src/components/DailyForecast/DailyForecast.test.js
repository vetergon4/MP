import React from 'react';
import ReactDOM from 'react-dom';
import DailyForecast from './DailyForecast';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DailyForecast />, div);
  ReactDOM.unmountComponentAtNode(div);
});