import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

const appTables = {
};

const schema = defineSchema({
  ...authTables,
  ...appTables,
});

export default schema;