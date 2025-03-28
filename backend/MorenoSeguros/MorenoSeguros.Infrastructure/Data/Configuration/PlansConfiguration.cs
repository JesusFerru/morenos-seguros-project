using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.PlansAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration
{
    public class PlansConfiguration : IEntityTypeConfiguration<Plans>
    {
        public void Configure(EntityTypeBuilder<Plans> builder)
        {
            builder.ToTable(nameof(Plans));
            builder.HasKey(p => p.Id);

            builder
                .HasOne(p => p.Company)
                .WithMany(c => c.Plans);
        }
    }
}
