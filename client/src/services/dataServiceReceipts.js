const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

//function for getting all receipts
async function getReceipts() {

    try {
        const response = await fetch(`${BASE_URL}/receipts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching receipts: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching receipts: " + error);
    }

}

//function for adding receipt
async function addReceipt(idUsera, idVessel, idBuoy, totalPrice, pdf) {
    const body = new URLSearchParams();
    body.append('idUsera', idUsera);
    body.append('idVessel', idVessel);
    body.append('idBuoy', idBuoy);
    body.append('totalPrice', totalPrice);
    body.append('pdf', pdf);

    const response = await fetch(`${BASE_URL}/receipts`, {
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
        throw new Error("Failed adding receipt: " + response.statusText);
    }
}

//function for getting users receipts
async function getUserReceipts(idUsera) {

    try {
        const response = await fetch(`${BASE_URL}/receipts/user/${idUsera}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching receipts: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching receipts: " + error);
    }

}

// get receipt by id
async function getReceiptById(idReceipt) {

    try {
        const response = await fetch(`${BASE_URL}/receipts/${idReceipt}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching receipt: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching receipt: " + error);
    }
}

async function getReceiptOfUser(idUser){
    try {
        const response = await fetch(`${BASE_URL}/receipts/user/${idUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching receipt: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching receipt: " + error);
    }
}

export {
    getReceipts,
    addReceipt,
    getUserReceipts,
    getReceiptById,
    getReceiptOfUser
};
