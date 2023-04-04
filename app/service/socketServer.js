import { WebSocketServer } from 'ws'
import { EventEmitter } from 'events'
export class SocketServer {
    emitter = new EventEmitter();
    constructor() {
        this.socket = null;
        this.server = new WebSocketServer({port:8080});
        this.server.on('connection', function connection(ws) {
            console.log("socket server is connected")
            ws.on('message', async function message(msg, isBinary) {
                console.log("incoming message for socket")
                this.socket = ws;
                var data = JSON.parse(msg.toString());
                if (data.action === 'message') {
                    this.emitter.emit('message', data)
                } else {
                    if (data.action === 'status') {
                        this.broadcast(data)
                    }
                }
            }.bind(this));
            ws.on('error', () => {
                console.log("error")
            })
            ws.on('pong', f => {
                console.log("ping hit")
            });
            setInterval(() => {
                ws.ping()
            }, 300000)//five minute interval for aws api timeout
        }.bind(this));
    }
    heartbeat(){
        console.log("ping hit")
    }
    broadcast(data) {
        this.server.clients.forEach(function each(client) {
            client.send(JSON.stringify(data),{binary:false})
        });
    }
}