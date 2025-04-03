using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration;
public class PaymentConfiguration : IEntityTypeConfiguration<Payments>
{
    public void Configure(EntityTypeBuilder<Payments> builder)
    {
        builder.ToTable(nameof(Payments));
        builder.HasKey(pa => pa.Id);

        builder.HasOne(pa => pa.Policy)
               .WithMany(po => po.Payments)
               .HasForeignKey(pa => pa.PolicyNumber)
               .HasPrincipalKey(po => po.PolicyNumber);
    }
}