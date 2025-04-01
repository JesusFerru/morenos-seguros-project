using MorenoSeguros.Core.Entities.UserAggregate.ValueObjects;
using MorenoSeguros.Core.SharedKernel;
using MorenoSeguros.Core.SharedKernel.Interfaces;

namespace MorenoSeguros.Core.Entities.UserAggregate;

public class User : BaseEntity, IAggregateRoot
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    // User Role : Admin, Collaborator
    public UserRole Role { get; set; } = UserRole.Collaborator;

    public User()
    {
        Username = string.Empty;
        Password = string.Empty;
    }

    public User(string firstName, string lastName, string dni, string phoneNumber, string username, string email, string role)
    {
        FirstName = firstName;
        LastName = lastName;
        Dni = dni;
        PhoneNumber = phoneNumber;
        Username = username;
        Email = email;
        Role = UserRole.FromName(role);
    }

    public User(string username, string password) : this()
    {
        Password = password;
        Username = username;
    }
}