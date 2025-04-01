namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetUserResult
    {
        public string Dni { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public GetUserResult(string dni, string fullName, string email, string phoneNumber, string role, string username)
        {
            Dni = dni;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            Role = role;
            Username = username;
        }
    }
}
