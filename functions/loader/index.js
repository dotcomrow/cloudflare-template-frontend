export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  // if homepage

  const asset = await context.env.ASSETS.fetch(url);
  // fetch config and inject
  console.log("handled html");
  return context.env.ASSETS.fetch(url);
};
