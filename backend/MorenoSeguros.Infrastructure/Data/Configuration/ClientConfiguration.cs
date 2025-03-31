using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.ClientAggregate;
using MorenoSeguros.Core.Entities.ClientAggregate.ValueObjects;

namespace MorenoSeguros.Infrastructure.Data.Configuration;

public class ClientConfiguration : IEntityTypeConfiguration<Clients>
{
    public void Configure(EntityTypeBuilder<Clients> builder)
    {
        builder.ToTable(nameof(Clients));
        builder.HasKey(c => c.Id);

        builder.Property(u => u.DocumentType)
                .HasConversion(
                docType => docType.Name,           // Convert from UserRole to string
                name => DocumentType.FromName(name, false) // Convert from string to UserRole
            )
            .IsRequired();
    }
}
