using MorenoSeguros.Core.UserAggregate;

namespace MorenoSeguros.Infrastructure.Data.Config;
public class UserConfiguration : IEntityTypeConfiguration<User>
{
  public void Configure(EntityTypeBuilder<User> builder)
  {
    builder.ToTable("Users");
    builder.HasKey(u => u.Id);

    builder.Property(u => u.Role)
        .HasConversion(
        role => role.Name,           // Convert from UserRole to string
        name => UserRole.FromName(name, false) // Convert from string to UserRole
    )
    .IsRequired();
  }
}
