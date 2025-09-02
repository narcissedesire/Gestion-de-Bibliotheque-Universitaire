import React from "react";

export default function TablePagination({
  page,
  limit,
  totalPages,
  setPage,
  setLimit,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
      <div className="flex items-center gap-2">
        <span>Afficher :</span>
        <select
          className="border rounded px-2 py-1"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
