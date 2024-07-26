export const onRequest = async (context) => {
    const url = new URL(context.request.url)
    // if homepage
    if (url.pathname === "/") {
        const asset = await context.env.ASSETS.fetch(url)
        return context.env.ASSETS.fetch(url)
    }
    return context.next()
}
