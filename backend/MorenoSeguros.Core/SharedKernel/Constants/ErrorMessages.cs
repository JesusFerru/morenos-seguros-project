using MorenoSeguros.Core.Exceptions;

namespace MorenoSeguros.Core.SharedKernel.Constants;

public static class ErrorMessages
{
    private static readonly Dictionary<string, string> _messages = new Dictionary<string, string>
    {
        // Mensajes fijos o con placeholders
        { nameof(UnauthorizedException), "Credenciales inválidas. Por favor, verifique sus datos: '{0}'" },
        { nameof(ForbiddenException), "Acceso Denegado. No tiene acceso a esta información." },
        { nameof(NotFoundException), " '{0}' no existe o no fue encontrado." },
        { nameof(BadRequestException), "La petición para '{0}' es incorrecta." },
        { nameof(ConflictException), "Existe un conflicto en '{0}'." },
        { ConflictErrorCode.GenericConflict.ToString(), "Existe un conflicto general en '{0}'." },
        { ConflictErrorCode.ResourceAlreadyExists.ToString(), " '{0}' ya existe." },
        { ConflictErrorCode.SecretNotConfigured.ToString(), "Secret Key de JWT no está configurado." }
        // Agrega otros mensajes predeterminados según tus necesidades.
    };

    public enum ConflictErrorCode
    {
        GenericConflict,
        ResourceAlreadyExists,
        SecretNotConfigured
        // Puedes ir añadiendo nuevos códigos según tus necesidades.
    }

    /// <summary>
    /// Obtiene el mensaje asociado a la clave especificada sin parámetros.
    /// </summary>
    public static string GetMessage(string key)
    {
        return _messages.TryGetValue(key, out var message) ? message : "Error inesperado.";
    }

    /// <summary>
    /// Obtiene el mensaje asociado a la clave especificada y le aplica los parámetros.
    /// </summary>
    public static string GetMessage(string key, params object[] args)
    {
        if (_messages.TryGetValue(key, out var message))
        {
            return string.Format(message, args);
        }
        return "Error inesperado.";
    }
}
