using MorenoSeguros.Core.Entities.PolicyAggregate;

namespace MorenoSeguros.Api
{
    public class PolicyMemberResult
    {
        public Guid Id { get; set; }
        public bool IsTitular { get; set; }
        public DateOnly? EntryDate { get; set; }
        public string? Status { get; set; }
        public string? Exclusions { get; set; }
        public string? MemberType { get; set; }
        public Guid? ClientId { get; set; }
        public Guid? PolicyId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public PolicyMemberResult(PolicyMember member)
        {
            Id = member.Id;
            IsTitular = member.IsTitular;
            EntryDate = member.EntryDate;
            Status = member.Status;
            Exclusions = member.Exclusions;
            MemberType = member.MemberType;
            ClientId = member.Client?.Id;
            PolicyId = member.Policy?.Id;
            IsActive = member.IsActive;
            CreatedAt = member.CreatedAt;
            UpdatedAt = member.UpdatedAt;
        }
    }
}
