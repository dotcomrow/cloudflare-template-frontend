import { GCPLogger } from "npm-gcp-logging";
import { GCPAccessToken } from "npm-gcp-token";

export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  // if homepage

  const asset = await context.env.ASSETS.fetch(url);
  // fetch config and inject
  var logging_token = await new GCPAccessToken(
    context.env.GCP_LOGGING_CREDENTIALS
  ).getAccessToken("https://www.googleapis.com/auth/logging.write");
  await GCPLogger.logEntry(
    context.env.GCP_LOGGING_PROJECT_ID,
    logging_token.access_token,
    context.env.LOG_NAME,
    [
      {
        severity: "INFO",
        // textPayload: message,
        jsonPayload: {
          asset: asset,
        },
      },
    ]
  );
  return context.env.ASSETS.fetch(url);
};
