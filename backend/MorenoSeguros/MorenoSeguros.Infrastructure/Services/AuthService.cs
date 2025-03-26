using Microsoft.IdentityModel.Tokens;
using MorenoSeguros.Core.Auth;
using MorenoSeguros.Core.Exceptions;
using MorenoSeguros.Core.Interfaces;
using MorenoSeguros.Core.SharedKernel.Constants;
using MorenoSeguros.Core.SharedKernel.Interfaces;
using MorenoSeguros.Core.UserAggregate;
using MorenoSeguros.Core.UserAggregate.Specification;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static MorenoSeguros.Core.SharedKernel.Constants.ErrorMessages;

namespace MorenoSeguros.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IRepository<User> _repository;

        public AuthService(IConfiguration configuration, IRepository<User> repository)
        {
            _configuration = configuration;
            _repository = repository;
        }

        public async Task<LoginResult?> AuthenticateAsync(string username, string password)
        {
            var spec = new GetUserByAuthSpec(username, password);
            var user = await _repository.SingleOrDefaultAsync(spec);
            if (user == null) return null;

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            return new LoginResult
            {
                AccessToken = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddHours(1),
                FullName = $"{user.FirstName} {user.LastName}",
                RoleUser = user.Role.Name,
                Username = user.Username
            };
        }

        public async Task<LoginResult?> RefreshTokenAsync(string accessToken, string refreshToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]
                ?? throw new ConflictException(ErrorMessages.GetMessage(ConflictErrorCode.SecretNotConfigured.ToString())));

            try
            {
                var tokenValidationParams = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = false // Queremos extraer claims incluso si el token expiró
                };

                var principal = handler.ValidateToken(accessToken, tokenValidationParams, out SecurityToken validatedToken);
                var userId = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                             ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid userGuid))
                    return null;

                var user = await _repository.GetByIdAsync(userGuid);
                if (user == null) return null;

                var newToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                return new LoginResult
                {
                    AccessToken = newToken,
                    RefreshToken = newRefreshToken,
                    Expiration = DateTime.UtcNow.AddHours(1),
                    FullName = $"{user.FirstName} {user.LastName}",
                    RoleUser = user.Role.Name,
                    Username = user.Username
                };
            }
            catch (Exception)
            {
                return null;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]
                ?? throw new ConflictException(ErrorMessages.GetMessage(ConflictErrorCode.SecretNotConfigured.ToString())));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role.Name),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }
    }
}
