import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/lib/database/index";

config({ path: ".env" });

const pg = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pg, schema: schema });
