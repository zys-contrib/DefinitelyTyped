import WebSocket = require("ws");
import * as http from "http";
import * as https from "https";
import * as net from "net";
import * as url from "url";
import * as wslib from "ws";

{
    const ws = new WebSocket("ws://www.host.com/path");
    ws.on("open", () => ws.send("something"));
    ws.on("message", data => {});
    // @ts-expect-error
    ws.send({ hello: "world" });

    ws.send(new Uint8Array([]));

    const Any = null as any;

    ws.send(Any as number);
    ws.send(Any as ArrayBufferView);
    ws.send(new Blob([]));
    ws.send(Any as { valueOf(): ArrayBuffer });
    ws.send(Any as Uint8Array);
    ws.send(Any as { valueOf(): Uint8Array });
    ws.send(Any as { valueOf(): string });
}

{
    const addr = new url.URL("ws://www.host.com/path");
    const ws = new WebSocket(addr);
    ws.on("open", () => {
        const array = new Float32Array(5);
        for (let i = 0; i < array.length; ++i) array[i] = i / 2;
        ws.send(array, { binary: true, mask: true });
    });
}

{
    const ws: wslib.WebSocket = new wslib.WebSocket("ws://www.host.com/path");
}

{
    const wss: wslib.WebSocketServer = new wslib.WebSocketServer({ port: 8081 });
}

{
    const wss = new WebSocket.Server({ port: 8081 });
    wss.on("connection", (ws, req) => {
        ws.on("message", message => console.log("received: %s", message));
        ws.send("something");
        ws.send("something", (error?: Error) => {});
        ws.send("something", {}, (error?: Error) => {});
    });
    wss.once("connection", (ws, req) => {
        ws.send("something");
    });
    wss.off("connection", (ws, req) => {
        ws.send("something");
    });
}

{
    const wss = new WebSocket.Server({ port: 8082 });

    const broadcast = (data: string) => {
        wss.clients.forEach(ws => ws.send(data));
    };
}

{
    const wsc = new WebSocket("ws://echo.websocket.org/");

    wsc.on("open", () => wsc.send(Date.now().toString(), { mask: true }));
    wsc.on("close", () => console.log("disconnected"));
    wsc.on("error", error => {
        console.log(`unexpected response: ${error}`);
    });

    wsc.on("message", (data) => {
        console.log(`Roundtrip time: ${Date.now() - parseInt(data.toString(), 10)} ms`);
        setTimeout(() => {
            wsc.send(Date.now().toString(), { mask: true });
        }, 500);
    });
}

{
    new WebSocket.Server({ server: https.createServer({}) });
    new WebSocket.Server({ server: http.createServer() });
}

{
    const wsv = new WebSocket.Server({
        server: http.createServer(),
        clientTracking: true,
        perMessageDeflate: true,
    });

    wsv.on("connection", function connection(ws) {
        console.log(ws.protocol);
    });
}

{
    const wss = new WebSocket.Server();

    wss.addListener("connection", (client, request) => {
        request.socket.remoteAddress;

        // @ts-expect-error
        request.aborted === 10;

        client.terminate();
        request.destroy();
    });

    wss.close();

    const addr = wss.address();

    if (addr === null) {
        // $ExpectType null
        addr;
    }
}

{
    new WebSocket.Server({ noServer: true, perMessageDeflate: false });
    new WebSocket.Server({ noServer: true, perMessageDeflate: {} });
    new WebSocket.Server({
        noServer: true,
        perMessageDeflate: {
            serverNoContextTakeover: true,
            clientNoContextTakeover: true,
            serverMaxWindowBits: 0,
            clientMaxWindowBits: 0,
            zlibDeflateOptions: {
                flush: 0,
                finishFlush: 0,
                chunkSize: 0,
                windowBits: 0,
                level: 0,
                memLevel: 0,
                strategy: 0,
                dictionary: new Buffer("test"),
                info: false,
            },
            zlibInflateOptions: {
                chunkSize: 0,
            },
        },
        verifyClient: (info: any, cb: any) => {
            cb(true, 123, "message", { Upgrade: "websocket" });
        },
        allowSynchronousEvents: false,
        autoPong: false,
    });
}

{
    const ws = new WebSocket("ws://www.host.com/path", {
        timeout: 5000,
        maxPayload: 10 * 1024 * 1024,
    });
    ws.on("open", () => ws.send("something assume to be really long"));
}

{
    const ws = new WebSocket("ws://www.host.com/path");
    ws.onopen = (event: WebSocket.Event) => {
        console.log(event.target, event.type);
    };
    ws.onerror = (event: WebSocket.ErrorEvent) => {
        console.log(event.error, event.message, event.target, event.type);
    };
    ws.onclose = (event: WebSocket.CloseEvent) => {
        console.log(event.code, event.reason, event.target, event.wasClean, event.type);
    };
    ws.onmessage = (event: WebSocket.MessageEvent) => {
        console.log(event.data, event.target, event.type);
    };
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    const duplex = WebSocket.createWebSocketStream(ws, {
        allowHalfOpen: true,
    });

    duplex.pipe(process.stdout);
    process.stdin.pipe(duplex);
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    const duplex = WebSocket.createWebSocketStream(ws);

    duplex.pipe(process.stdout);
    process.stdin.pipe(duplex);
}

{
    const ws = new WebSocket("ws://www.host.com/path");
    // @ts-expect-error
    ws.addEventListener("other", () => {});
    // @ts-expect-error
    ws.removeEventListener("other", () => {});
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    const listenerFn = (event: WebSocket.MessageEvent) => console.log(event.data, event.target, event.type);
    ws.addEventListener("message", listenerFn, { once: true });
    ws.removeEventListener("message", listenerFn);

    ws.addEventListener("open" as "open" | "close" | "error" | "message", console.log);
    ws.removeEventListener("open" as "open" | "close" | "error" | "message", console.log);

    const listenerObj = {
        handleEvent(event: WebSocket.MessageEvent) {
            console.log(this, event);
        },
    };
    ws.addEventListener("message", listenerObj);
    ws.removeEventListener("message", listenerObj);
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    ws.addListener("redirect", (url, request) => {
        // $ExpectType string
        url;
        // $ExpectType ClientRequest
        request;
    });
}

{
    const ws = new WebSocket("ws://www.host.com/path");
    const eventHandler: Parameters<typeof ws.once>[1] = () => {};
    const event = "";
    const errorHandler = (err: Error) => {
        ws.off(event, eventHandler);
    };
    ws.once("error", errorHandler);
}

function f() {
    const ws = new WebSocket("ws://www.host.com/path");

    // @ts-expect-error
    const a: 5 = ws.readyState;

    // @ts-expect-error
    ws.readyState = ws.OPEN;

    // @ts-expect-error
    ws.readyState = !ws.OPEN;

    if (ws.readyState === ws.OPEN) {
        // @ts-expect-error
        const a: 2 = ws.readyState;
        const x: 1 = ws.readyState;
        return;
    }
    if (ws.readyState === ws.CONNECTING) {
        const x: 0 = ws.readyState;
        return;
    }
    if (ws.readyState === ws.CLOSING) {
        const x: 2 = ws.readyState;
        return;
    }
    if (ws.readyState === ws.CLOSED) {
        const x: 3 = ws.readyState;
        return;
    }

    // $ExpectType never
    const x: never = ws.readyState;
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    // @ts-expect-error
    ws.CONNECTING = 123;

    // @ts-expect-error
    ws.OPEN = 123;

    // @ts-expect-error
    ws.CLOSING = 123;

    // @ts-expect-error
    ws.CLOSED = 123;
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    ws.binaryType = "arraybuffer";
    ws.binaryType = "fragments";
    ws.binaryType = "nodebuffer";

    // @ts-expect-error
    ws.binaryType = "";
    // @ts-expect-error
    ws.binaryType = true;
    // @ts-expect-error
    ws.binaryType = "invalid-value";
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    // $ExpectType number
    ws.bufferedAmount;
    // $ExpectType string
    ws.extensions;
    // $ExpectType string
    ws.protocol;

    // @ts-expect-error
    ws.bufferedAmount = 1;
    // @ts-expect-error
    ws.bufferedAmount = true;

    // @ts-expect-error
    ws.extensions = "a-value";
    // @ts-expect-error
    ws.extensions = true;

    // @ts-expect-error
    ws.protocol = "a-value";
    // @ts-expect-error
    ws.protocol = true;
}

{
    const webSocketServer = new WebSocket.WebSocketServer();
    const server = new http.Server();
    server.on("upgrade", (request, socket, head) => {
        if (request.url === "/path") {
            webSocketServer.handleUpgrade(request, socket, head, (ws) => {
                webSocketServer.emit("connection", ws, request);
            });
        }
    });
}

declare module "ws" {
    interface Server {
        getWebSocketId(): string;
    }
}

{
    class MyWebSocket extends WebSocket {
        id?: string;
    }
    const server = new wslib.WebSocketServer({ WebSocket: MyWebSocket });

    server.on("connection", (ws) => {
        // $ExpectType string | undefined
        ws.id;

        ws.id = server.getWebSocketId();
    });
}

{
    const ws = new WebSocket("ws://www.host.com/path", {
        generateMask: (mask) => {},
        skipUTF8Validation: true,
    });
}

{
    class CustomWebSocket extends WebSocket.WebSocket {
        foo(): "foo" {
            return "foo";
        }
    }
    const server = new http.Server();
    const webSocketServer = new WebSocket.WebSocketServer({ WebSocket: CustomWebSocket, noServer: true });
    webSocketServer.on("connection", (ws) => {
        // $ExpectType CustomWebSocket
        ws;
        // $ExpectType "foo"
        ws.foo();
    });
    Array.from(webSocketServer.clients).forEach((ws) => {
        // $ExpectType CustomWebSocket
        ws;
        // $ExpectType "foo"
        ws.foo();
    });
    server.on("upgrade", (request, socket, head) => {
        if (request.url === "/path") {
            webSocketServer.handleUpgrade(request, socket, head, (ws) => {
                // $ExpectType CustomWebSocket
                ws;
                // $ExpectType "foo"
                ws.foo();
            });
        }
    });
}

{
    const ws = new WebSocket("ws://www.host.com/path");

    if (ws.isPaused) {
        ws.resume();
    } else {
        ws.pause();
    }

    // @ts-expect-error
    ws.isPaused = true;

    ws.onopen = null;
    ws.onerror = null;
    ws.onclose = null;
    ws.onmessage = null;
}

{
    class Request extends http.IncomingMessage {}
    class MyWebsocket extends WebSocket {}
    const server = http.createServer({ IncomingMessage: Request });
    const wss = new WebSocket.WebSocketServer({ WebSocket: MyWebsocket, server });

    wss.on("connection", (ws, req) => {
        // $ExpectType MyWebsocket
        ws;
        // $ExpectType Request
        req;
    });
    wss.once("connection", (ws, req) => {
        // $ExpectType MyWebsocket
        ws;
        // $ExpectType Request
        req;
    });
    wss.off("connection", (ws, req) => {
        // $ExpectType MyWebsocket
        ws;
        // $ExpectType Request
        req;
    });
    wss.addListener("connection", (ws, req) => {
        // $ExpectType MyWebsocket
        ws;
        // $ExpectType Request
        req;
    });
    wss.removeListener("connection", (ws, req) => {
        // $ExpectType MyWebsocket
        ws;
        // $ExpectType Request
        req;
    });

    wss.on("headers", (_headers, req) => {
        // $ExpectType Request
        req;
    });
    wss.once("headers", (_headers, req) => {
        // $ExpectType Request
        req;
    });
    wss.off("headers", (_headers, req) => {
        // $ExpectType Request
        req;
    });
    wss.addListener("headers", (_headers, req) => {
        // $ExpectType Request
        req;
    });
    wss.removeListener("headers", (_headers, req) => {
        // $ExpectType Request
        req;
    });

    wss.on("wsClientError", (error, socket, req) => {
        // $ExpectType Error
        error;
        // $ExpectType Duplex
        socket;
        // $ExpectType Request
        req;
    });
    wss.off("wsClientError", (error, socket, req) => {
        // $ExpectType Error
        error;
        // $ExpectType Duplex
        socket;
        // $ExpectType Request
        req;
    });

    Array.from(wss.clients).forEach(client => {
        // $ExpectType MyWebsocket
        client;
    });
}

{
    const ws = new WebSocket("ws://www.host.com/path", {
        allowSynchronousEvents: false,
        autoPong: false,
        createConnection: net.createConnection,
        finishRequest: (req, socket) => {
            // $ExpectType ClientRequest
            req;

            // $ExpectType WebSocket
            socket;
        },
    });
}
