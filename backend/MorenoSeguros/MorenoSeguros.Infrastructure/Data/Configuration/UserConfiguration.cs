using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.UserAggregate;
using MorenoSeguros.Core.UserAggregate.ValueObjects;

namespace MorenoSeguros.Infrastructure.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable(nameof(User));
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Role)
                .HasConversion(
                role => role.Name,           // Convert from UserRole to string
                name => UserRole.FromName(name, false) // Convert from string to UserRole
            )
            .IsRequired();
        }
    }
}
