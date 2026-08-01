import { ManualHerbalifeProvider } from "./manual-herbalife";
import type { FulfillmentProvider } from "./types";

export type {
  FulfillmentOrder,
  FulfillmentOrderItem,
  FulfillmentProvider,
  FulfillmentResult,
} from "./types";

export function getFulfillmentProvider(): FulfillmentProvider {
  return new ManualHerbalifeProvider();
}
