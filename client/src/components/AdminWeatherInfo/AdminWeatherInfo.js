import React from 'react';
import PropTypes from 'prop-types';

import Weather from '../Weather/Weather';

const AdminWeatherInfo = () => {
   return <div>
      <Weather />
   </div>;

};

AdminWeatherInfo.propTypes = {};

AdminWeatherInfo.defaultProps = {};

export default AdminWeatherInfo;
