using Ardalis.SmartEnum;

namespace MorenoSeguros.Core.Entities.ClientAggregate.ValueObjects;

public class DocumentType : SmartEnum<DocumentType>
{
    public static readonly DocumentType CI = new(nameof(CI), 1);
    public static readonly DocumentType Passport = new(nameof(Passport), 2);

    private DocumentType(string name, int value) : base(name, value) { }
}
