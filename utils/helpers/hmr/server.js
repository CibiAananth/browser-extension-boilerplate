import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';

const clientMap = new Map();
let clientIndex = 1;
function serverScript() {
    const ws = new WebSocketServer({ port: 5000 });
    ws.on('connection', (ws) => {
        clientMap.set(clientIndex++, ws);
        ws.onclose = () => {
            clientMap.delete(clientIndex);
        };
        ws.onmessage = message => {
            if (message.data.type === 'UPDATE_COMPLETE') {
                console.log('UPDATE_COMPLETE');
                ws.close();
            }
        };
    });
}
const timeoutSrc = function (path) {
    // Normalize path on Windows
    setTimeout(() => {
        const pathConverted = path.replace(/\\/g, '/');
        clientMap.forEach((ws) => ws.send(JSON.stringify({
            type: 'UPDATE_PENDING',
            path: pathConverted,
        })));
        // Delay waiting for public assets to be copied
    }, 1000);
};
chokidar.watch('src').on('all', (_e, path) => timeoutSrc(path));
const timeoutDist = () => {
    setTimeout(() => {
        clientMap.forEach((ws) => {
            ws.send(JSON.stringify({
                type: 'UPDATE_REQUEST',
            }));
        });
    }, 1000);
};
chokidar.watch('dist').on('all', event => {
    // Ignore unlink, unlinkDir and change events
    // that happen in beginning of build:watch and
    // that will cause ws.send() if it takes more than 400ms
    // to build (which it might)
    if (event !== 'add' && event !== 'addDir')
        return;
    timeoutDist();
});
serverScript();
console.log('starting server at 5000');

export { serverScript };
