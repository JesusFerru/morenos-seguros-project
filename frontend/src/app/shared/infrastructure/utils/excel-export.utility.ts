import { ExcelExportService } from '../services/excel-export.service';

/**
 * Utility class to provide Excel export functionality to components
 */
export class ExcelExportUtility {
    
    /**
     * Generic export method that can be used by any component
     * @param data Array of data to export
     * @param fileName Name for the Excel file
     * @param columnMapping Mapping of object keys to display headers
     * @param excelService Injected Excel export service
     * @param onSuccess Success callback
     * @param onError Error callback
     */
    static exportToExcel<T>(
        data: T[],
        fileName: string,
        columnMapping: { [key: string]: string },
        excelService: ExcelExportService,
        onSuccess: (message: string) => void,
        onError: (message: string) => void
    ): void {
        try {
            if (data.length === 0) {
                onError('No hay datos para exportar.');
                return;
            }

            excelService.exportToExcelWithMapping(
                data,
                fileName,
                columnMapping,
                fileName.charAt(0).toUpperCase() + fileName.slice(1)
            );

            onSuccess('Archivo Excel exportado exitosamente.');

        } catch (error) {
            console.error('Excel export error:', error);
            onError('Error al exportar el archivo Excel.');
        }
    }

    /**
     * Common column mappings for different entity types
     */
    static readonly COLUMN_MAPPINGS = {
        clients: {
            firstName: 'Nombre',
            lastName: 'Apellido',
            email: 'Email',
            phoneNumber: 'Teléfono',
            documentType: 'Tipo Documento',
            documentNumber: 'Número Documento',
            birthDate: 'Fecha Nacimiento',
            nit: 'NIT',
            businessName: 'Empresa',
            city: 'Ciudad',
            address: 'Dirección',
            employmentStatus: 'Estado Empleo',
            fundOrigin: 'Origen Fondos',
            incomeRange: 'Rango Ingresos',
            isActive: 'Activo'
        },
        users: {
            dni: 'DNI',
            username: 'Usuario',
            firstName: 'Nombre',
            lastName: 'Apellido',
            role: 'Rol',
            isActive: 'Activo'
        },
        policies: {
            policyNumber: 'Número de Póliza',
            previousPolicyNumber: 'Póliza Anterior',
            titularClientName: 'Cliente Titular',
            agentName: 'Agente',
            startDate: 'Fecha Inicio',
            endDate: 'Fecha Fin',
            deductible1: 'Monto Deducible',
            status: 'Estado',
            isActive: 'Activo',
            createdAt: 'Fecha Creación',
            updatedAt: 'Última Actualización'
        },
        companies: {
            id: 'ID',
            name: 'Nombre',
            nit: 'NIT',
            email: 'Email',
            phoneNumber: 'Teléfono',
            address: 'Dirección',
            city: 'Ciudad',
            isActive: 'Activo'
        },
        plans: {
            id: 'ID',
            name: 'Nombre',
            description: 'Descripción',
            basePremium: 'Prima Base',
            coverage: 'Cobertura',
            deductible: 'Deducible',
            isActive: 'Activo'
        },
        payments: {
            id: 'ID',
            policyNumber: 'Número Póliza',
            amount: 'Monto',
            paymentDate: 'Fecha Pago',
            paymentMethod: 'Método Pago',
            status: 'Estado',
            receiptUrl: 'URL Recibo'
        },
        banks: {
            id: 'ID',
            name: 'Nombre',
            accountNumber: 'Número Cuenta',
            accountType: 'Tipo Cuenta',
            swiftCode: 'Código SWIFT',
            isActive: 'Activo'
        }
    };
}