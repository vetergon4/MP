const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


//function for registering user - send data to server and save token to local storage, if registration is successful
async function registerUser(formData) {
  const body = new URLSearchParams(formData);
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await response.json();

  // Save token to local storage if registration is successful
  if (response.ok) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

// Function for login
async function loginUser(formData) {
  const body = new URLSearchParams(formData);
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await response.json();

  // Save token to local storage if login is successful
  if (response.ok) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

// Function to update user information
async function updateUser(id, formData) {
  const body = new URLSearchParams(formData);
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

async function getUserInformation(id) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user information. Status: ${response.status}`);
    }
    //console.log("v data service je response: " + response);
    const data = await response.json();

    //console.log("data je: " + data);

    return data;
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    throw error;
  }
}

//function for deleting user
async function deleteUser(id) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
}

function logout() {
  localStorage.removeItem("token");
}

//get token function, returning token from local storage
function getToken() {
  return localStorage.getItem("token");
}

//is loggedIn function, checking if token is in local storage
function checkIfLoggedIn() {
  const token = getToken();
  if (token) {
    const payload = JSON.parse(b64Utf8(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } else {
    return false;
  }
}

function b64Utf8(input) {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(input), function (character) {
        return "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}


//get current user function, returning user data from token
function currentUser() {
  if (checkIfLoggedIn()) {
    const token = getToken();
    const payload = JSON.parse(b64Utf8(token.split(".")[1]));

    return payload;
  }
}

const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // You might want to handle errors appropriately in your UI components
  }
};

export { registerUser, loginUser, deleteUser, logout, getToken, checkIfLoggedIn, currentUser, updateUser, getUserInformation, getUsers };
