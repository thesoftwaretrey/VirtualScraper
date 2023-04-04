import { ClusterHost } from './app/scrape/cluster.js'
import { SocketServer } from './app/service/socketServer.js'
const cluster = new ClusterHost();
cluster.emitter.addListener('done',f => {
    server.broadcast(f)
})
const server = new SocketServer();
server.emitter.addListener('message', async data => {
    console.log("Incoming message for query: " + data?.data?.query)
    cluster.setCreds(data);
    await cluster.queue(data);
})