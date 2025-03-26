using MorenoSeguros.Core.Auth;

namespace MorenoSeguros.Core.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResult?> AuthenticateAsync(string username, string password);
        Task<LoginResult?> RefreshTokenAsync(string accessToken, string refreshToken);
    }
}
