# Fulfillment vía panel Herbalife

## Estado

En investigación. MVP: pedidos se guardan en nuestra DB; el afiliado los cumple **manualmente** en el panel web de Herbalife.

## Flujo MVP

1. Cliente hace pedido en nuestra web (con o sin Stripe).
2. Se crea `Order` + `OrderItem` con snapshot de `externalProductUrl`.
3. `ManualHerbalifeProvider` marca el pedido como listo para el afiliado (admin / notificación).
4. El afiliado abre cada URL de producto y completa el pedido en el panel Herbalife.
5. En admin, cambia el estado (`processing` → `shipped`, etc.).

## Por documentar (Fase 1 del PLAN)

- [ ] Pasos exactos en el panel (capturas o lista numerada)
- [ ] Ejemplo real de URL de producto
- [ ] Si existe SKU / código de producto útil
- [ ] Si hay API o partner oficial (sin scraping)
- [ ] Decisión: pago online (Stripe) vs solo reserva

## Contrato interno (orientativo)

Ver `lib/fulfillment/types.ts` → `FulfillmentOrder`.

## No hacer

- Automatizar login del panel sin diseño consciente y cumplimiento de ToS.
- Asumir stock local.
