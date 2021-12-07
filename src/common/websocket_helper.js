class WebSocketHelper {
    constructor( url, poll_interval ) {
        this.url           = url;
        this.poll_interval = poll_interval;
        this.connection    = null;
        this.timer         = null;
    }

    createConnection() {
        this.connection           = new WebSocket( this.url );
        this.connection.onopen    = this.onOpen;
        this.connection.onclose   = this.onClose;
        this.connection.onerror   = this.onError;
        this.connection.onmessage = this.onMessage;
        this.timer                = setInterval( this.poll, this.poll_interval );
    }

    start() {
        if( !this.connection || this.connection.readyState === WebSocket.CLOSED ) {
            this.createConnection();
        }
    }

    onMessage = ( event ) => {
        console.log( 'Please assign a function pointer to this function' )
    }

    onOpen = ( event ) => {
        clearTimeout( this.poll_interval );
    }

    onClose = ( event ) => {
        console.log( "Socket is closed, trying to reconnect", event.reason );
        clearInterval( this.timer );
        setTimeout( this.start(), this.poll_interval );
    }

    onError = ( error ) => {
        console.error( "Websocket error", error.message, "Closing socket");
        clearInterval( this.timer );
        this.connection.close();
    }

    poll = () => {
        if( this.connection && this.connection.readyState === WebSocket.OPEN ) {
            this.connection.send( Math.random() );
        }
    };
}


export default WebSocketHelper;