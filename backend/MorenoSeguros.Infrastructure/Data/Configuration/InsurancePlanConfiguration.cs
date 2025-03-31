using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.InsuranceCompanyAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration;

public class InsurancePlanConfiguration : IEntityTypeConfiguration<InsurancePlan>
{
    public void Configure(EntityTypeBuilder<InsurancePlan> builder)
    {
        builder.ToTable(nameof(InsurancePlan));
        builder.HasKey(p => p.Id);

        builder.HasMany(p => p.DeductibleOptions)
               .WithOne(d => d.InsurancePlan);
    }
}
