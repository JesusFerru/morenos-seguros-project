import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    /**
     * Export data to Excel file
     * @param data Array of objects to export
     * @param fileName Name of the Excel file (without extension)
     * @param sheetName Name of the worksheet
     */
    exportToExcel<T>(data: T[], fileName: string, sheetName: string = 'Sheet1'): void {
        try {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            
            // Convert data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);
            
            // Auto-size columns
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
            const columnWidths: XLSX.ColInfo[] = [];
            
            for (let col = range.s.c; col <= range.e.c; col++) {
                let maxWidth = 10;
                for (let row = range.s.r; row <= range.e.r; row++) {
                    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                    const cell = worksheet[cellAddress];
                    if (cell && cell.v) {
                        const cellValue = String(cell.v);
                        maxWidth = Math.max(maxWidth, cellValue.length);
                    }
                }
                columnWidths.push({ width: Math.min(maxWidth + 2, 50) });
            }
            worksheet['!cols'] = columnWidths;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            
            // Generate Excel file buffer
            const excelBuffer = XLSX.write(workbook, { 
                bookType: 'xlsx', 
                type: 'array',
                compression: true
            });
            
            // Save file
            this.saveExcelFile(excelBuffer, fileName);
            
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            throw new Error('Failed to export data to Excel');
        }
    }

    /**
     * Export data with custom headers and formatting
     * @param data Array of objects to export
     * @param fileName Name of the Excel file
     * @param columnMapping Object mapping data keys to display headers
     * @param sheetName Name of the worksheet
     */
    exportToExcelWithMapping<T>(
        data: T[], 
        fileName: string, 
        columnMapping: { [key: string]: string },
        sheetName: string = 'Sheet1'
    ): void {
        try {
            // Transform data with custom headers
            const transformedData = data.map(item => {
                const transformedItem: any = {};
                Object.keys(columnMapping).forEach(key => {
                    const value = (item as any)[key];
                    transformedItem[columnMapping[key]] = this.formatCellValue(value);
                });
                return transformedItem;
            });

            this.exportToExcel(transformedData, fileName, sheetName);

        } catch (error) {
            console.error('Error exporting to Excel with mapping:', error);
            throw new Error('Failed to export data to Excel');
        }
    }

    /**
     * Save Excel file buffer to disk
     * @param buffer Excel file buffer
     * @param fileName File name without extension
     */
    private saveExcelFile(buffer: ArrayBuffer, fileName: string): void {
        const blob = new Blob([buffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        saveAs(blob, `${fileName}_${timestamp}.xlsx`);
    }

    /**
     * Format cell values for Excel export
     * @param value Cell value to format
     */
    private formatCellValue(value: any): any {
        if (value === null || value === undefined) {
            return '';
        }
        
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        
        if (typeof value === 'boolean') {
            return value ? 'Sí' : 'No';
        }
        
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        
        return value;
    }

    /**
     * Get current timestamp for file naming
     */
    private getTimestamp(): string {
        return new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    }
}