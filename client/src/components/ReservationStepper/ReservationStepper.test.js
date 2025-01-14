import React from 'react';
import ReactDOM from 'react-dom';
import ReservationStepper from './ReservationStepper';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReservationStepper />, div);
  ReactDOM.unmountComponentAtNode(div);
});