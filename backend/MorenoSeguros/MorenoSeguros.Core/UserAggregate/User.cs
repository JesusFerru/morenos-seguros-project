using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.UserAggregate;

public class User : BaseEntity, IAggregateRoot
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Ci { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Username { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    // User Role : Admin, Collaborator
    public UserRole Role { get; set; } = UserRole.Collaborator;

    public User()
    {
        Username = string.Empty;
        Password = string.Empty;
    }

    public User(string firstName, string lastName, string ci, string email)
    {
        FirstName = firstName;
        LastName = lastName;
        Ci = ci;
        Email = email;
    }

    public User(string? username, string email, string password) : this()
    {
        Password = password;
        Email = email;
        Username = username;
    }
}