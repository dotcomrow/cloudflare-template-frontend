export const onRequest = async (context) => {
    const url = new URL(context.request.url)
    // if homepage
    if (fileExtension(url.pathname) === 'html') {
        const asset = await context.env.ASSETS.fetch(url)
        // fetch config and inject
        console.log("handled html")
        return context.env.ASSETS.fetch(url)
    }
    return context.next()
}

var fileExtension = function( url ) {
    return url.split('.').pop().split(/\#|\?/)[0];
}