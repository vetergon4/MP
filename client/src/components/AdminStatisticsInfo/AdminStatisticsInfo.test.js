import React from 'react';
import ReactDOM from 'react-dom';
import AdminStatisticsInfo from './AdminStatisticsInfo';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminStatisticsInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});