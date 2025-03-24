namespace MorenoSeguros.Api.Endpoints
{
    public class GetUserResult
    {
        public string Ci { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }

        public GetUserResult(string ci, string fullName, string email)
        {
            Ci = ci;
            FullName = fullName;
            Email = email;
        }
    }
}
