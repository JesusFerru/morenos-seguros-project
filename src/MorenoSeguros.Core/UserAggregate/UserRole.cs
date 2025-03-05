namespace MorenoSeguros.Core.UserAggregate;
public class UserRole : SmartEnum<UserRole>
{
  public static readonly UserRole Admin = new(nameof(Admin), 1);
  public static readonly UserRole Collaborator = new(nameof(Collaborator), 2);
  protected UserRole(string name, int value) : base(name, value) { }

  /// <summary>
  /// Define a Marker Class for the Feature
  ///Create an empty class to represent the feature.
  ///For example, for managing users:
  public class ManageUsersFeature { }
  /// </summary>

  public void CheckPermissionFor<T>()
  {
    string featureName = typeof(T).Name;
    if (this == Collaborator && featureName == nameof(ManageUsersFeature))
    {
      throw new UnauthorizedAccessException("Collaborators do not have permission to manage users.");
    }
  }
}
