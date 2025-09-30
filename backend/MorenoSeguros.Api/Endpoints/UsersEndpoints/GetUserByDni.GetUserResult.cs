namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetUserResult
    {
        public Guid Id { get; set; }
        public string Dni { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public GetUserResult(Guid id, string dni, string firstName, string lastName, string? email, string? phoneNumber, string role, string username, bool isActive, DateTime createdAt, DateTime? updatedAt)
        {
            Id = id;
            Dni = dni;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
            Role = role;
            Username = username;
            IsActive = isActive;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }
    }
}
