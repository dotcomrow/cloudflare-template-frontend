export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  const asset = await context.env.ASSETS.fetch(url);
  var body = await asset.text();

  console.log(context.env)
  body = body.replace(/{\"config\":\"config\"}/g, JSON.stringify(context.env.CONFIGS));

  return new Response(body, asset);
};
