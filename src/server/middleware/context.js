import { getAccount } from '../actions/account';
import actions from '../../client/actions'

/**
 * Middleware for creating the context
 * @param req
 * @param res
 * @param next
 */
export default async function(ctx, next) {
    // Get our token from headers (server) or cookies (client)
    ctx.token = ctx.headers['token'] || ctx.cookies.get('token')

    // Create the context with params and hostname for SSR
    const state = {
        common: {
            hostname: ctx.headers.host
        }
    }

    // Check if logged in
    const account = await getAccount(ctx.token)
    if (account) {
        state.account = account
    }

    // Finally initialize state. This should come last
    ctx.stores = actions(state, ctx.token)
    await next()
}
