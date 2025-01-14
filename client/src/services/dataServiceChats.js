const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

//function for adding chat
async function addChat(members, timestamp) {
    console.log("members", members);
    
    try {
        const response = await fetch(`${BASE_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ members, timestamp }),
        });

        if (!response.ok) {
            throw new Error("Failed to add chat: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding chat: " + error);
    }
}

//function for getting all chats
async function getChats() {

    try {
        const response = await fetch(`${BASE_URL}/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching chats: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching chats: " + error);
    }

}

//function for getting chats of user
async function getUserChats(userId) {
    try {
        const response = await fetch(`${BASE_URL}/chats/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching user chats: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user chats: " + error);
    }
}

//function for getting specific chat by members
async function findChat(members) {
    try {
        const response = await fetch(`${BASE_URL}/chats/find?members=${JSON.stringify(members)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching chat: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching chat: " + error);
    }
}

export { addChat, getChats, getUserChats, findChat };