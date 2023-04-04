import { WebSocket } from 'ws'
import { EventEmitter } from 'events'
export class SocketClient {
    constructor(endpoint) {
        this.emitter = new EventEmitter();
        this.url = endpoint;
        this.socket = new WebSocket(this.url, { perMessageDeflate: false });

        this.socket.on('open', () => {
            this.emitter.emit("open",true)
        });
        console.log(new Date().toLocaleTimeString())
        this.socket.on('message', (message) => {
            this.emitter.emit('message',message)
        })
        this.socket.on('error', (err) => {
            this.socket = new WebSocket(this.url, { perMessageDeflate: false })
        })
        this.socket.on('close', () => {
            this.socket = new WebSocket(this.url, { perMessageDeflate: false })
        })
    }
    send(data){
        this.socket.send(data)
    }

}