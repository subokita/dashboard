import Timer  from 'tiny-timer'
import config from "../config.json"

class WebSocketHelper {
    constructor( url, poll_interval ) {
        this.url           = url;
        this.poll_interval = poll_interval;
        this.connection    = null;
        this.timer         = null;

        this.timer = new Timer();
    }

    createConnection() {
        this.connection           = new WebSocket( `${config.websocket.domain}${this.url}` );
        this.connection.onopen    = this.onOpen;
        this.connection.onclose   = this.onClose;
        this.connection.onerror   = this.onError;
        this.connection.onmessage = this.onMessage;
        // this.timer                = setInterval( this.poll, this.poll_interval );

        this.timer.on( 'tick', (ms) => this.poll() );
        this.timer.start({ interval: this.poll_interval, stopwatch: false })
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
        // clearInterval( this.timer );
        this.timer.stop();
        setTimeout( this.start(), this.poll_interval );
    }

    onError = ( error ) => {
        console.error( "Websocket error", error.message, "Closing socket");
        // clearInterval( this.timer );
        this.timer.stop();
        this.connection.close();
    }

    poll = () => {
        if( this.connection && this.connection.readyState === WebSocket.OPEN ) {
            this.connection.send( Math.random() );
        }
    };

    pause = () => {
        this.timer.pause();
    };

    resume = () => {
        this.timer.resume();
    };
}


export default WebSocketHelper;