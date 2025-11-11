import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  page: number;
  setPage: (selected: number) => void;
}

export default function Pagination({
  totalPages,
  page,
  setPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      onPageChange={({ selected }) => setPage(selected)}
      pageRangeDisplayed={5}
      pageCount={totalPages}
      previousLabel="←"
      renderOnZeroPageCount={null}
      containerClassName={css.pagination}
      activeClassName={css.active}
      forcePage={page - 1}
    />
  );
}
