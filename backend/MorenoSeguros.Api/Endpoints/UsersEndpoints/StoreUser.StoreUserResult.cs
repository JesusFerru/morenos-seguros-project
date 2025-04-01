namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class StoreUserResult
    {
        public string FullName { get; set; } = string.Empty;
        public string Dni { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string Role { get; set; } = string.Empty;
    }
}
