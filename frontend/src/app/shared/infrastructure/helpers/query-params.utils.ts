import { HttpParams } from '@angular/common/http';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';

export class QueryParamsUtils {
// Función para construir la cadena de consulta genérica
    static buildQueryString<T extends ChangePaginationModel>(filter: T): HttpParams {
    let params = new HttpParams();

    // Recorrer todas las propiedades del objeto filter
    for (const [key, value] of Object.entries(filter)) {
        // Agregar solo las propiedades que tienen un valor definido
        if (value !== undefined && value !== null) {
        params = params.append(key, value.toString());
        }
    }

    return params;
    }
}
