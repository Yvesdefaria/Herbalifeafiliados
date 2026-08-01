import type {
  FulfillmentOrder,
  FulfillmentProvider,
  FulfillmentResult,
} from "./types";

export class ManualHerbalifeProvider implements FulfillmentProvider {
  readonly name = "manual-herbalife";

  async submitOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    return {
      ok: true,
      provider: this.name,
      message:
        "Pedido registrado para cumplimiento manual en el panel Herbalife.",
      externalReference: order.id,
    };
  }
}
