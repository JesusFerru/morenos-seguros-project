import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangePaginationModel } from 'app/shared/domain/models/ChangePaginationModel';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'ms-table',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatIconModule,
        MatSlideToggleModule
    ],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
    private _liveAnnouncer = inject(LiveAnnouncer);

    @ViewChild(MatPaginator) private paginator!: MatPaginator;

    @Input() columns: Array<any> = [];
    @Input() data: Array<any> = [];
    @Input() total: number = 0;
    @Input() pageSize: number = 10;
    @Input() isPagination: boolean = true;
    @Input() isList: boolean = true;

    @Output() edit = new EventEmitter<any>();
    @Output() changePaginator = new EventEmitter<ChangePaginationModel>();
    @Output() toggleStatus = new EventEmitter<any>();

    public paginatedData: Array<any> = [];
    public displayedColumns: string[] = [];

    ngOnInit(): void {
        if (this.data) {
            this.data = this.data.map(r => ({ ...r, actions: '' }));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns'] && this.columns) {
            this.displayedColumns = this.columns.map(x => x.columnDef);
        }
        if (!this.isPagination) {
            this.total = this.data.length;
        }
        this.sliceData();
    }

    public onEdit(row: any): void {
        this.edit.emit(row);
    }

    public onToggleStatus(row: any): void {
        this.toggleStatus.emit(row);
    }

    public changePage(event: ChangePaginationModel): void {
        if (this.isPagination && this.paginator) {
            const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
            const endIndex = startIndex + this.paginator.pageSize;
            this.paginatedData = this.data.slice(startIndex, endIndex);
            this.changePaginator.emit(event);
        }
    }

    private sliceData(): void {
        const last = this.data.length <= 100 ? this.data.length : 10;
        this.paginatedData = this.data.slice(0, last);
    }
}
