

function App() {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buoys, setBuoys] = useState([]);
  
    const openModal = (marker) => {
      setSelectedMarker(marker);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    useEffect(() => {
      // Make a GET request to fetch buoy data from the server
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

      axios.get(`${apiUrl}/buoys`)
        .then((response) => {
          const data = response.data; // Assuming response.data is a JSON object
          const buoysArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
          setBuoys(buoysArray);
        })
        .catch((error) => console.error(error));
    }, []);
    return (
        <div>
        <h1><FontAwesomeIcon icon={faSailboat} />Kaprije marine</h1>
        <div style={{ width: '100%', height: '600px' }}>
          <LoadScript
          >
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={{ lat: 43.6864586, lng: 15.7091269 }}
              zoom={17.41}
            >
              {buoys.map((buoy, index) => (
                <MarkerF
                  key={index}
                  position={{ lat: buoy.lat, lng: buoy.lng }}
                  onClick={() => openModal(buoy)}
                />
              ))}
        
        
              {selectedMarker && (
                <CustomModal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  marker={selectedMarker}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
        </div>
        
    );
  }
  
  export default App;