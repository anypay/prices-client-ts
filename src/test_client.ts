import { createClient } from './'

const client = createClient()

client.subscribeToPricesUpdates()

client.on('price/updated', (price) => {
    console.log('Price updated', price)
})

client.on('websocket.error', (err) => {
    console.error('Websocket error', err)
})

client.on('websocket.open', () => {
    console.log('Websocket open')
})

client.on('websocket.message', (data) => {
    console.log(data)
})