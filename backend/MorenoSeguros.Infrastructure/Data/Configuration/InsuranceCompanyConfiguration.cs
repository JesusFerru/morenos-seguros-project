using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.CompanyAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration;

public class InsuranceCompanyConfiguration : IEntityTypeConfiguration<InsuranceCompany>
{
    public void Configure(EntityTypeBuilder<InsuranceCompany> builder)
    {
        builder.ToTable(nameof(InsuranceCompany));
        builder.HasKey(ic => ic.Id);

        builder.HasMany(ic => ic.Plans)
            .WithOne(p => p.InsuranceCompany);
    }
}
