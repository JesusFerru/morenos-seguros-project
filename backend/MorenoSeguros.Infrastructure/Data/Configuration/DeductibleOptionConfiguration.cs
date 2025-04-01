using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration;

public class DeductibleOptionConfiguration : IEntityTypeConfiguration<DeductibleOption>
{
    public void Configure(EntityTypeBuilder<DeductibleOption> builder)
    {
        builder.ToTable(nameof(DeductibleOption));
        builder.HasKey(d => d.Id);
    }
}
