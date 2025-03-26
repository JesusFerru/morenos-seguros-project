namespace MorenoSeguros.Api.Endpoints.UsersEndpoints
{
    public class GetUserResult
    {
        public string Ci { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public GetUserResult(string ci, string fullName, string email, string phoneNumber, string role)
        {
            Ci = ci;
            FullName = fullName;
            Email = email;
            PhoneNumber = phoneNumber;
            Role = role;
        }
    }
}
