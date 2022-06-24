
/**
 * Return the differences between two array
 **/
export const differences = ( a, b ) => (
    a.filter( x => !b.includes( x ) )
);

class Logger {
    constructor() {
        this._debug = document.getElementById( 'debug' );
    }

    log( ...logs ) {
        for ( var index in logs ) {
            this._debug.innerText += `${ JSON.stringify(logs[index]) }\n`;
        }
    }

    clear() {
        this._debug.innerText = "";
    }
}


export const out_of_range = ( index: int, current: int ) => (
    index < current - 1 || index > current + 1
);


export const logger = new Logger();
