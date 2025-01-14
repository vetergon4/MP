import React from 'react';
import ReactDOM from 'react-dom';
import AdminWeatherInfo from './AdminWeatherInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminWeatherInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});