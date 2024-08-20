import { GCPLogger } from "npm-gcp-logging";
import { GCPAccessToken } from "npm-gcp-token";
import { serializeError } from "serialize-error";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { numeric, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/d1";

const config_include_list = ["apiBase"];

export const onRequest = async (context) => {

  body = body.replace(
    /{\"config\":\"config\"}/g,
    JSON.stringify(response_configs)
  );

  return new Response(body, asset);

  
  const url = new URL(context.request.url);
  const asset = await context.env.ASSETS.fetch(url);
  var body = await asset.text();

  const db = drizzle(context.env.CONFIGURATION);
  const config = sqliteTable("config", {
    code: varchar("code").notNull().primaryKey(),
    code_value: varchar("code_value").notNull(),
    last_update_datetime: numeric("last_update_datetime").notNull(),
  });

  try {
    var response_configs = {};
    var res = await db.select().from(config);

    for (const config of res) {
      if (config_include_list.includes(config.code)) {
        response_configs[config.code] = config.code_value;
      }
    }

    body = body.replace(
      /{\"config\":\"config\"}/g,
      JSON.stringify(response_configs)
    );

    return new Response(body, asset);
  } catch (error) {
    await init(context.env);
  }
  return new Response(
    JSON.stringify({
      message: "Configuration missing!",
    }),
    {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    }
  );
};

async function init(env) {
  try {
    await env.CONFIGURATION.prepare(
      `CREATE TABLE config (
      code varchar(64) PRIMARY KEY,
      code_value varchar(256),
      last_update_datetime numeric)`
    ).run();
  } catch (e) {
    var logging_token = await new GCPAccessToken(
      env.GCP_LOGGING_CREDENTIALS
    ).getAccessToken("https://www.googleapis.com/auth/logging.write");
    const responseError = serializeError(e);
    await GCPLogger.logEntry(
      env.GCP_LOGGING_PROJECT_ID,
      logging_token.access_token,
      env.LOG_NAME,
      [
        {
          severity: "ERROR",
          // textPayload: message,
          jsonPayload: {
            responseError,
          },
        },
      ]
    );
  }
}
