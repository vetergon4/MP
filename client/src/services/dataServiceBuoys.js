const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

//function for getting all buoys
async function getBuoys() {

    try {
        const response = await fetch(`${BASE_URL}/buoys`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching buoys: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching buoys: " + error);
    }

}

//function get buoy by id
async function getBuoyById(idBuoy) {
    try {
        const response = await fetch(`${BASE_URL}/buoys/id/${idBuoy}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching buoy info: " + response.statusText);
        }

        const data = await response.json();
        return data.buoy;
    } catch (error) {
        console.error("Error fetching buoy info: " + error);
    }
}

//function for counting buoys that are paid
async function getNumberOfPaidBuoys() {
    try {
        const response = await fetch(`${BASE_URL}/buoys/paid`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching buoys: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching buoys: " + error);
    }
}


//function for geting buoy by qrdata! NOT qrcodehash 
async function getBuoyByQrData(qrData) {
    try {
        const response = await fetch(`${BASE_URL}/buoys/qrData/${qrData}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching buoy info: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching buoy info: " + error);
    }

}

//function for updating buoy based on id, attributes of buoy that need to be changed are in body
async function updateBuoy(idBuoy, formData) {
    console.log("Form data: ", formData );
    const body = new URLSearchParams(formData);
    console.log("Body: ", body);    
    try {
        const response = await fetch(`${BASE_URL}/buoys/update/${idBuoy}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        if (!response.ok) {
            throw new Error("Failed updating buoy: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating buoy: " + error);
    }
}

//function for getting users on buoys
async function getUsersOnBuoys () {
    try {
        const response = await fetch(`${BASE_URL}/buoys/occupied/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching users on buoys: " + response.statusText);
        }

        const data = await response.json();
        console.log("Data in dataServiceBuoys: ", data);
        return data;
    } catch (error) {
        console.error("Error fetching users on buoys: " + error);
    }
}

export {
    getBuoys,
    getBuoyById,
    getNumberOfPaidBuoys,
    getBuoyByQrData,
    updateBuoy,
    getUsersOnBuoys
};
