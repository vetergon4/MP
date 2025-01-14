import React from 'react';
import ReactDOM from 'react-dom';
import MakeReservation from './MakeReservation';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MakeReservation />, div);
  ReactDOM.unmountComponentAtNode(div);
});