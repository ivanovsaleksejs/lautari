import state from './state.js'

class WebSocketClient {
    constructor(serverUrl) {
        this.ws = new WebSocket(serverUrl);
        this.userId = this.getCookie('userId');
        
        this.ws.onopen = () => {
            console.log("WebSocket connection established.");
            this.ws.send(JSON.stringify({ command: 'connect', userId: this.userId }));
        };
        
        this.ws.onmessage = this.handleMessage.bind(this);
    }

    send(command, payload = {}) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ command, ...payload }));
        } else {
            this.ws.onopen = () => this.ws.send(JSON.stringify({ command, ...payload }));
        }
    }

    createRoom() {
        this.send('createRoom');
    }

    joinRoom(roomId) {
        this.send('joinRoom', { roomId, userId: this.userId });
    }

    makeMove(roomId, data) {
        this.send('makeMove', { roomId, userId: this.userId, payload: data });
    }

    sendMessage(roomId, msg) {
        this.send('sendMessage', { roomId, userId: this.userId, payload: msg });
    }

    handleMessage(event) {
        const data = JSON.parse(event.data);
        if (data.command === 'connected' && data.userId) {
            this.setCookie('userId', data.userId, 365);
            this.userId = data.userId;
            console.log('User ID set:', data.userId);
        }
        
        switch (data.command) {
            case 'roomCreated':
                console.log('Room created:', data.roomId);
                break;
            case 'joinedRoom':
                console.log(`Joined room ${data.roomId} as ${data.role}`);
                break;
            case 'userJoined':
                console.log(`User ${data.userId} joined as ${data.role}`);
                break;
            case 'moveMade':
                console.log('Move made:', data.move);
                break;
            case 'newMessage':
                console.log(`Message from ${data.message.userId}: ${data.message.text}`);
                break;
            default:
                console.log('Unknown command:', data);
        }
    }

    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }
}

export default WebSocketClient
