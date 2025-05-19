namespace MorenoSeguros.Api.Controllers
{
    public class PolicyMemberCommand
    {
        public bool IsTitular { get; set; }
        public DateOnly? EntryDate { get; set; }
        public string? Status { get; set; }
        public string? Exclusions { get; set; }
        public string? MemberType { get; set; }
        public Guid ClientId { get; set; }
        public Guid PolicyId { get; set; }
    }
}
