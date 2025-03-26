namespace MorenoSeguros.Core.Auth;
public class LoginResult
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string RoleUser { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
}