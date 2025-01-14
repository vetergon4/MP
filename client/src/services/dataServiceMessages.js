const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';


//function for posting a message
async function addMessage(senderId, text, timestamp, chatId) {
    try {
        const response = await fetch(`${BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderId, text, timestamp, chatId }),
        });

        if (!response.ok) {
            throw new Error("Failed to add message: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding message: " + error);
    }
}

//get messages of chat
async function getMessages(chatId) {

   //if code is 406b there are no messages so return empty array
    try {
        const response = await fetch(`${BASE_URL}/messages/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error("Failed fetching messages: " + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching messages: " + error);
    }


}

export { addMessage, getMessages };