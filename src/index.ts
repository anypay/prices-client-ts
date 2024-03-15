
import axios from 'axios';
import { WebSocket } from 'ws'
import { EventEmitter } from 'events';

export interface Price {
    base: string;
    quote: string;
    value: number;
}

export interface Conversion {
    base: {
        currency: string;
        value: number;
    },
    quote: {
        currency: string;
        value: number;
    },
    timestamp: Date
}

export interface Message {
    topic: string;
    payload: any
}

export interface NewConversionParams {
    base: string;
    value: number;
    quote: string;
}

export interface ClientOptions {
    http_api_url?: string;
    websocket_api_url?: string;
    token?: string;
}

export const defaultClientOptions: ClientOptions = {
    http_api_url: 'https://prices.anypayx.com',
    websocket_api_url: 'wss://prices.anypayx.com',
    token: undefined
}

interface WireProtocolSchemeas {
    [key: string]: any;
}

const schemas: WireProtocolSchemeas = {};

export interface PriceUpdatedMessage extends Message {
    topic: 'price/updated';
    payload: Price;
}

schemas['price/updated'] = {
    type: 'object',
    properties: {
        base: { type: 'string' },
        quote: { type: 'string' },
        value: { type: 'number' },
        source: { type: 'string'},
        updated_at: { type: 'string', format: 'date-time'}
    },
    required: ['base', 'quote', 'value', 'source', 'updated_at']
}

export class Client extends EventEmitter {
    http_api_url: string;
    websocket_api_url: string;
    socket: WebSocket | undefined;
    shouldConnectSocket: boolean = false;
    token: string | undefined;
    constructor(options: ClientOptions = {}) {
        super();
        this.http_api_url = options.http_api_url || String(defaultClientOptions.http_api_url);
        this.websocket_api_url = options.websocket_api_url || String(defaultClientOptions.websocket_api_url);
    }

    subscribeToPricesUpdates() {
        this.shouldConnectSocket = true;
        this.socket = new WebSocket(this.websocket_api_url, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        this.socket.on('open', () => {
            this.emit('websocket.open')
            this.sendMessage({
                topic: 'subscribe',
                payload: {
                    topics: ['price/updated']
                }
            })
        });
        this.socket.on('message', (data: Message) => {
            const message = JSON.parse(data.toString()) as Message
            this.emit('websocket.message', message)
            try {
                this.onMessage(message);
            } catch(error) {
                this.emit('websocket.error', error)
            }
            
        });

        this.socket.on('close', () => {
            this.socket = undefined;
            if (this.shouldConnectSocket) {
                setTimeout(() => {
                    this.subscribeToPricesUpdates();
                }, 1000);
            }
        });

        this.socket.on('error', (err) => {
            this.emit('websocket.error', err)
            console.error('Socket error', err);
        });
    }

    unsubscribeFromPricesUpdates() {
        this.shouldConnectSocket = false;
        this.socket?.close();
    }

    private sendMessage(data: Message) {
        this.socket?.send(JSON.stringify(data));
    }

    private onMessage(data: Message) {        
        if (data.topic === 'price/updated') {
            const event = data as PriceUpdatedMessage;
            this.emit('price/updated', event);
        }
    }

    async listPrices() {
        const { data } = await axios.get<{prices: Price[]}>(`${this.http_api_url}/api/prices`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return data.prices;
    }

    async getPrice({ base, quote, source }: { base: string, quote: string, source?: string }) {
        const { data } = await axios.get<{price: Price}>(`${this.http_api_url}/api/prices/{base}/{quote}/{source}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return data.price;
    }

    async convertPrice(params: NewConversionParams): Promise<Conversion>  {
        
        const { data } = await axios.post<{conversion: Conversion}>(`${this.http_api_url}/api/conversions`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        })

        return data.conversion;
    }
}

export function createClient(options?: ClientOptions) {
    return new Client(options);
}