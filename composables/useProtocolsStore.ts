import type { Protocol } from "~/server/database/schema";
import { ProtocolRepository } from "~/repositories/ProtocolRepository";

const protocolRepository = new ProtocolRepository()
export const useProtocolsStore = createEntityStore<Protocol>(
  'protocols',
  protocolRepository,
)