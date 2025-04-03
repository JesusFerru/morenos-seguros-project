using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Infrastructure.Data.Configuration;

public class PolicyMemberConfiguration : IEntityTypeConfiguration<PolicyMember>
{
    public void Configure(EntityTypeBuilder<PolicyMember> builder)
    {
        builder.ToTable(nameof(PolicyMember));
        builder.HasKey(pm => pm.Id);

        builder.HasOne(pm => pm.Client)
               .WithMany(c => c.PolicyMemberships);

        builder.HasOne(pm => pm.Policy)
               .WithMany(p => p.PolicyMembers);
    }
}
