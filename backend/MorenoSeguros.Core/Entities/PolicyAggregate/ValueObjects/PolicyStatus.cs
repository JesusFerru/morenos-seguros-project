using Ardalis.SmartEnum;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.ValueObjects;

public enum PolicyStatus
{
    Draft,          // Borrador
    Active,         // Vigente
    PendingPayment, // Emitida pero sin pago
    Cancelled,      // Cancelada
    Expired,        // Finalizó su periodo
    Suspended       // Suspendida
}
