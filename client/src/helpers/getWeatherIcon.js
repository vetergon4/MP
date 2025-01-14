const getWeatherIcon = (code) => {
    const iconMapping = {
        '01d': '/public/weather-icons/01d.png',
        '01n': '/weather-icons/01n.png',
        '02d': '/weather-icons/02d.png',
        '02n': '/weather-icons/02n.png',
        '03d': '/weather-icons/03d.png',
        '03n': '/weather-icons/03n.png',
        '04d': '/weather-icons/04d.png',
        '04n': '/weather-icons/04n.png',
        '09d': '/weather-icons/09d.png',
        '09n': '/weather-icons/09n.png',
        '10d': '/weather-icons/10d.png',
        '10n': '/weather-icons/10n.png',
        '11d': '/weather-icons/11d.png',
        '11n': '/weather-icons/11n.png',
        '13d': '/weather-icons/13d.png',
        '13n': '/weather-icons/13n.png',
        '50d': '/weather-icons/50d.png',
        '50n': '/weather-icons/50n.png',
    };

    console.log('Weather icon path:', iconMapping[code] || '/weather-icons/default.png');
    return iconMapping[code] || '/weather-icons/default.png';
};

export default getWeatherIcon;