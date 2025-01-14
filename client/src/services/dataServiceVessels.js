const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

//function for adding vessel
async function addVessel(id, formData) {
    const body = new URLSearchParams(formData);
    body.append('id', id); //!!

    const response = await fetch(`${BASE_URL}/vessels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('token', data.token);
    }

    //console.log("in service: ", data)
    return data.newVessel;
}


//function for getting a specific vessel
async function getVessel(idVessel) {
    try {
        const response = await fetch(`${BASE_URL}/vessels/${idVessel}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch vessel information. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching vessel information: ', error.message);
        throw error;
    }
}

//update vessel
async function updateVessel(idVessel, formData) {
    const body = new URLSearchParams(formData);
    //add id of vessel to body
    body.append('idVessel', idVessel);
    const response = await fetch(`${BASE_URL}/vessels/${idVessel}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
    const data = await response.json();

    return data;
}

//delete vessel
async function deleteVessel(idVessel) {
    console.log("id v dataservice: " + idVessel);
    const body = new URLSearchParams();
    //add id of vessel to body
    body.append('idVessel', idVessel);
    const response = await fetch(`${BASE_URL}/vessels/${idVessel}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });
    const data = await response.json();
    console.log("data: " + data);
    if (response.ok) {
        localStorage.setItem('token', data.token);
      }
    return data;
}

//get current user vessel information from token
function getVesselInformation() {
    if (checkIfLoggedIn()) {
        const token = getToken();
        const payload = JSON.parse(b64Utf8(token.split(".")[1]));

        return payload.vessel;
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

export { getVessel, updateVessel, deleteVessel, getVesselInformation, addVessel };