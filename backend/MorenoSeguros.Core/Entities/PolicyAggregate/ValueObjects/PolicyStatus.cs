using Ardalis.SmartEnum;

namespace MorenoSeguros.Core.Entities.PolicyAggregate.ValueObjects;

public class PolicyStatus : SmartEnum<PolicyStatus>
{
    public static readonly PolicyStatus Draft = new(nameof(Draft), 1);                     // Póliza en borrador o edición
    public static readonly PolicyStatus Active = new(nameof(Active), 2);                   // Vigente
    public static readonly PolicyStatus PendingPayment = new(nameof(PendingPayment), 3);   // Emitida pero sin pago
    public static readonly PolicyStatus Cancelled = new(nameof(Cancelled), 4);             // Cancelada por usuario o sistema
    public static readonly PolicyStatus Expired = new(nameof(Expired), 5);                 // Finalizó su periodo
    public static readonly PolicyStatus Suspended = new(nameof(Suspended), 6);             // Suspendida temporalmente

    private PolicyStatus(string name, int value) : base(name, value) { }
}
