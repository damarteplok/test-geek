export class PaginationEntity<T> {
  results: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  next: number | null;
  previous: number | null;

  constructor(
    results: T[],
    currentPage: number,
    pageSize: number,
    totalItems: number,
    next: number | null,
    previous: number | null,
  ) {
    this.results = results;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.next = next;
    this.previous = previous;
  }
}
