export interface PaginationResponseModel<T> {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages : number;
    data : Array<T>;
  }
  