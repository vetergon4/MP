import React from 'react';
import ReactDOM from 'react-dom';
import CurrentWeather from './CurrentWeather';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CurrentWeather />, div);
  ReactDOM.unmountComponentAtNode(div);
});