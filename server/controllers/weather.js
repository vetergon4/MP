const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m,wind_speed_10m,winddirection_10m,precipitation,weathercode,cloudcover,visibility',
        daily: 'temperature_2m_max,temperature_2m_min,windspeed_10m_max,windgusts_10m_max,precipitation_sum,sunrise,sunset',
        timezone: 'auto'
      }
    });
    console.log(response.data);  // Log the API response
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Error fetching weather data' });
  }
};

const getWind = async (req, res) => {
  const { latitude, longitude } = req.query;
  const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
          latitude: latitude,
          longitude: longitude,
          hourly: 'wind_speed_10m,wind_direction_10m'
      }
  });
  res.json(data);
}

module.exports = {
  getWeather,
  getWind
};
