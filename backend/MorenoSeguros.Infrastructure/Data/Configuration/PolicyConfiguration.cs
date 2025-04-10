using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.PolicyAggregate;
using MorenoSeguros.Core.Entities.PolicyAggregate.ValueObjects;

namespace MorenoSeguros.Infrastructure.Data.Configuration;
public class PolicyConfiguration : IEntityTypeConfiguration<Policy>
{
    public void Configure(EntityTypeBuilder<Policy> builder)
    {
        builder.ToTable(nameof(Policy));
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Status)
                .HasConversion(
                policyStatus => policyStatus.Name,           // Convert from UserRole to string
                name => PolicyStatus.FromName(name, false) // Convert from string to UserRole
            )
            .IsRequired();

        // Foreign key: Titular Client
        builder.HasOne(p => p.TitularClient)
               .WithMany()
               .HasForeignKey(p => p.TitularClientId);

        // Foreign key: Agent (User)
        builder.HasOne(p => p.Agent)
               .WithMany()
               .HasForeignKey(p => p.AgentId);

        // Foreign key: Bank Account
        builder.HasOne(p => p.BankAccount)
               .WithMany();

        // Foreign key: DeductibleOption
        builder.HasOne(p => p.DeductibleOption)
               .WithMany(d => d.Policies)
               .HasForeignKey(p => p.DeductibleOptionId);

        // Relación recursiva con PreviousPolicyNumber
        builder.HasOne<Policy>()
               .WithMany()
               .HasForeignKey(p => p.PreviousPolicyNumber)
               .HasPrincipalKey(p => p.PolicyNumber)
               .IsRequired(false);
    }
}