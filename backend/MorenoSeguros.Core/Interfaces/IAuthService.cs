using MorenoSeguros.Core.Auth;
using MorenoSeguros.Core.Entities.UserAggregate;

namespace MorenoSeguros.Core.Interfaces;
public interface IAuthService
{
    Task<LoginResult?> AuthenticateAsync(string username, string password);
    Task<LoginResult?> RefreshTokenAsync(string accessToken, string refreshToken);
    string HashPassword(User user, string password);
    bool VerifyPassword(User user, string password);
}
