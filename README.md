# @anypay/prices-client

## Overview

`@anypay/prices-client` is a TypeScript library for connecting to and interacting with the Anypay Prices API. This client library provides easy access to real-time financial market price updates and conversion rates. It's built for both browser and Node.js environments, making it versatile for various applications, including web apps, server-side applications, and more.

## Features

- Real-time price updates via WebSocket.
- Fetch current prices and conversion rates through HTTP API.
- Automatic reconnection to WebSocket in case of disconnection.
- Typed interfaces for easy integration and development within TypeScript projects.

## Installation

Install `@anypay/prices-client` using npm:

```bash
npm install @anypay/prices-client
```

Or using yarn:

```bash
yarn add @anypay/prices-client
```

## Usage

### Creating a Client

First, import and create a client instance. You can optionally pass in configuration options.

```typescript
import { createClient } from '@anypay/prices-client';

const client = createClient({
  http_api_url: 'https://prices.anypayx.com', // Optional custom API URL
  websocket_api_url: 'wss://prices.anypayx.com', // Optional custom WebSocket URL
  token: 'your_api_token_here', // Optional API token for authenticated requests
});
```

### Subscribing to Price Updates

To listen for real-time updates on prices:

```typescript
client.subscribeToPricesUpdates();

client.on('price/updated', (price) => {
  console.log('Price updated', price);
});

client.on('websocket.error', (err) => {
  console.error('WebSocket error', err);
});

client.on('websocket.open', () => {
  console.log('WebSocket open');
});

client.on('websocket.message', (data) => {
  console.log(data);
});
```

### Unsubscribing from Price Updates

To stop receiving price updates:

```typescript
client.unsubscribeFromPricesUpdates();
```

### Fetching Prices and Conversions

Fetch current prices:

```typescript
async function fetchPrices() {
  const prices = await client.listPrices();
  console.log(prices);
}
fetchPrices();
```

Convert one currency to another:

```typescript
async function convertCurrency() {
  const conversion = await client.convertPrice({
    base: 'USD',
    value: 1000,
    quote: 'BTC'
  });
  console.log(conversion);
}
convertCurrency();
```

## Development

This library is open for contributions! Clone the repository, install dependencies, and make sure to follow the coding standards and commit message guidelines.

## Testing

Run the test suite to ensure your changes do not break existing functionality:

```bash
npm run test
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.

---

This README provides a comprehensive guide to using the `@anypay/prices-client` library, from installation to making API calls for price updates and conversions. Adjust the content as needed to match the specifics of your project and its development workflow.