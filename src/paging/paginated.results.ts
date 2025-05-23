export interface PaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    perPage: number;
    totalPages: number;
    currentPage: number;
  };
}