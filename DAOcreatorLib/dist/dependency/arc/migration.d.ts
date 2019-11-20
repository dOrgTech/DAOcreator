import {
  DAOMigrationParams,
  DAOMigrationCallbacks,
  DAOMigrationResult
} from "./types";
export declare const migrateDAO: (
  dao: DAOMigrationParams,
  callbacks: DAOMigrationCallbacks
) => Promise<DAOMigrationResult | undefined>;
