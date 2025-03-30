import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    inject
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { DateTime } from 'luxon';

@Component({
    selector: 'ms-table',
    standalone: true,
    imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        CommonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule
    ],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
    _liveAnnouncer = inject(LiveAnnouncer);

    @ViewChild(MatPaginator) private paginator!: MatPaginator;
    isLoading: boolean = false;
    displayedColumns: string[] = [];
    @Input() columns: Array<any> = [];
    @Input() data: Array<any> = [];

    @Output() action = new EventEmitter();
    @Output() changePaginator = new EventEmitter();
    @Output() retry = new EventEmitter<any>();
    @Output() onWarning = new EventEmitter<any>();
    @Output() onCollectionNote = new EventEmitter<any>();
    @Output() viewDetails = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();
    @Output() assign = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Output() toggleStatus = new EventEmitter<any>();
    @Output() toggleUtilStatus = new EventEmitter<any>();

    @Input() total: number = 0;
    @Input() pageSize: number = 10;
    @Input() isPagination: boolean = true;
    @Input() isList: boolean = true;

    public paginatedData: Array<any> = [];
    public totalSize: number = 0;
    decimalPipe = new DecimalPipe('en-US');

    orderBy: { column: string; direction: 'asc' | 'desc' } = {
        column: '',
        direction: 'asc',
    };

    ngOnInit(): void {
        if (this.data) {
            this.data = this.data.map(r => ({ ...r, actions: '' }));
            this.totalSize = this.data.length;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns'] && this.columns) {
            this.displayedColumns = this.columns.map(x => x.columnDef);
        }
        this.totalSize = this.data.length;
        if (!this.isPagination) {
            this.total = this.totalSize;
        }
        this.sliceData();
    }

    public onAction(type: string, row: any): void {
        this.action.emit({ type, row });
    }

    public getStatusLabel(value: string, statusList: any): string {
        const status = statusList.find(s => s.value === value);
        return status ? status.label : 'Sin Label';
    }

    public geDate(value: string): string {
        return value ? value.substring(0, 10) : '';
    }

    public getStatusColor(value: string, statusList: any): string {
        const status = statusList.find(s => s.value === value);
        if (status) {
            const color = status.color;
            return `bg-${color}-200 text-${color}-800 dark:bg-${color}-600 dark:text-${color}-50`;
        }
        return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
    }

    public sliceData(): void {
        const last = this.data.length <= 100 ? this.data.length : 10;
        this.paginatedData = this.data.slice(0, last);
    }

    public getStatusColorPayments(value: string, statusList: any): string {
        const status = statusList.find(s => s.value === value);
        return status ? status.color : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-50';
    }

    public changePage(event: ChangePaginationModel): void {
        if (this.isPagination) {
            const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
            const endIndex = startIndex + this.paginator.pageSize;
            this.paginatedData = this.data.slice(startIndex, endIndex);
            this.changePaginator.emit(event);
        }
    }

    public onRetry(row: any): void {
        row.isRetrying = true;
        this.retry.emit(row);
    }

    public onWarnings(row: any): void {
        this.onWarning.emit(row);
    }
    public onCollectionNotes(row: any): void {
        this.onCollectionNote.emit(row);
    }
    public onViewDetails(row: any): void {
        this.viewDetails.emit(row);
    }

    public onCancel(row: any): void {
        this.cancel.emit(row);
    }

    isToday(paymentDate: string): boolean {
        if (!paymentDate) return false;

        const expectedFormat = 'dd/MM/yyyy HH:mm:ss';
        const paymentDateTime = DateTime.fromFormat(paymentDate, expectedFormat);

        if (!paymentDateTime.isValid) {
            console.error(`Fecha inválida: ${paymentDate}`);
            return false;
        }

        const todayStart = DateTime.local().startOf('day');
        const todayEnd = DateTime.local().endOf('day');

        return paymentDateTime >= todayStart && paymentDateTime <= todayEnd;
    }

    public onEdit(row: any): void {
        this.edit.emit(row);
    }

    public onAssign(row: any): void {
        console.log(row);
        this.assign.emit(row);
    }

    public onDelete(row: any): void {
        this.delete.emit(row);
    }

    public onToggleStatus(row: any): void {
        this.toggleStatus.emit(row);
    }

    public onToggleUtilStatus(row: any): void {
        this.toggleUtilStatus.emit(row);
    }
}
