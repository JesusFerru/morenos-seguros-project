namespace MorenoSeguros.Api.Endpoints.Login
{
    public class RefreshTokenCommand
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
