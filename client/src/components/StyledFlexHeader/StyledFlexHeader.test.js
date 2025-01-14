import React from 'react';
import ReactDOM from 'react-dom';
import StyledFlexHeader from './StyledFlexHeader';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StyledFlexHeader />, div);
  ReactDOM.unmountComponentAtNode(div);
});