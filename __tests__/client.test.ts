
import { createClient, Conversion, Price } from '../src'

describe("Prices Client", () => {

    it('should subscribe to prices updates via websocket', (done) => {

        const client = createClient()

        client.subscribeToPricesUpdates()

        client.on('price/updated', (price: Price) => {

            client.unsubscribeFromPricesUpdates()

            done()

        })

    })

    it('maintains a cache of prices', () => {

    })

    it('converts one price to another', async () => {

        const client = createClient()

        const conversion: Conversion = await client.convertPrice({
            base: 'USD',
            value: 1000,
            quote: 'BTC'            
        })

        expect(conversion).toBeDefined()
        expect(conversion.base.value).toBeGreaterThan(0)
        expect(conversion.quote.value).toBeGreaterThan(0)

    })

})