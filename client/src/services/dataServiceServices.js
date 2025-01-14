const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

//Stripe payment
async function stripePayment(amount) {
  const response = await fetch(`${BASE_URL}/stripe/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });

  return response.json();
}

//Stripe checkout session
async function stripeCheckoutSession(amount) {
  try {
    const response = await fetch(`${BASE_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error('No session ID returned from the server');
    }

    return data;
  } catch (error) {
    console.error('Error in stripeCheckoutSession:', error);
    throw error;
  }
}


//idUsera, type,buoy
async function addService(idUsera, type, buoy) {
  const body = new URLSearchParams();
  body.append('idUsera', idUsera);
  body.append('type', type);
  body.append('buoy', buoy);

  try {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      // Log the error message from the response
      console.log('Error:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    // Handle fetch error
    console.log('Fetch error:', error.message);
    throw new Error('Failed adding service: ' + error.message);
  }
}


//function for changin status of service
async function updateServiceStatus(idService, status) {
  const response = await fetch(`${BASE_URL}/services/${idService}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return response.json();
}

async function getAllServices() {
  //get services data and remove from array every which has vessel or user <1

  const res = await fetch(`${BASE_URL}/services`);
  const data = await res.json();
  //filter
  const filteredServices = data.filter((service) => service.vessel > 0 && service.user > 0);
  return filteredServices;
}

async function getServicesByUser(idUsera) {
  const res = await fetch(`${BASE_URL}/services/user/${idUsera}`);
  const data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error('Failed fetching services: ' + res.statusText);
  };
}

//get service of user type berth
async function getBerthService(idUsera) {
  const res = await fetch(`${BASE_URL}/services/berth/${idUsera}`);
  const data = await res.json();
  console.log("service data: ",data);
  if (res.ok) {
    return data;
  } else {
    throw new Error('Failed fetching berth service: ' + res.statusText);
  };
}

async function getServicesByType(type) {
  const res = await fetch(`${BASE_URL}/services/type/${type}`);
  return res.json();
}

async function getPendingServices() {
  const res = await fetch(`${BASE_URL}/services/pending`);
  return res.json();
}



export { stripePayment, stripeCheckoutSession, addService, updateServiceStatus, getAllServices, getServicesByUser, getServicesByType, getPendingServices, getBerthService };