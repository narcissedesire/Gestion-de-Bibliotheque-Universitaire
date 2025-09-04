import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useLibrairie } from "../../context/LibrairieContext";
import TableFilters from "./TableFilters";
import EditModal from "./EditModal";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../pages/Loading/Loading";
import DetailModal from "./DetailModal";

export default function CardTableLivre({ filterGenre }) {
  const {
    livreAll,
    loading,
    page,
    limit,
    totalPages,
    search,
    genre,
    disponibilite,
    setSearch,
    setGenre,
    setDisponibilite,
    setPage,
    setLimit,
    fetchLivreAll,
    deleteLivre,
    updateLivre,
  } = useLibrairie();

  const { token } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [idLivre, setIdLivre] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Persistance dans localStorage
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("livreFilters"));
    if (storedData) {
      setPage(storedData.page || 1);
      setLimit(storedData.limit || 5);
      setSearch(storedData.search || "");
      setGenre(storedData.genre || "");
      setDisponibilite(storedData.disponibilite || "");
    }
  }, [setPage, setLimit, setSearch, setGenre, setDisponibilite]);

  useEffect(() => {
    localStorage.setItem(
      "livreFilters",
      JSON.stringify({ page, limit, search, genre, disponibilite })
    );
  }, [page, limit, search, genre, disponibilite]);

  // Appliquer le filtre de genre si fourni
  useEffect(() => {
    if (filterGenre && genre !== filterGenre) {
      setGenre(filterGenre);
      setPage(1);
    }
  }, [filterGenre, genre, setGenre, setPage]);

  // Re-fetch data when filters or pagination change
  useEffect(() => {
    if (token) {
      fetchLivreAll();
    }
  }, [token, search, genre, disponibilite, page, limit, fetchLivreAll]);

  const handleReset = () => {
    setSearch("");
    setGenre("");
    setDisponibilite("");
    setPage(1);
    setLimit(5);
    localStorage.removeItem("livreFilters");
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    console.log("Selected book for edit:", book);
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLivre(idLivre);
      toast.success("Livre supprimé avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la suppression du livre.");
    }
    setDeleteModalOpen(false);
    setIdLivre(null);
  };

  const handleSaveEdit = async (updatedBook) => {
    try {
      await updateLivre(updatedBook.id, updatedBook);
      toast.success("Livre modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      toast.error("Erreur lors de la modification du livre.");
    }
    setEditModalOpen(false);
    setSelectedBook(null);
  };

  const truncateText = (text, length = 20) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const columns = [
    {
      header: "Titre",
      accessorKey: "titre",
      sortable: true,
      cell: (info) => truncateText(info.getValue(), 20),
    },
    {
      header: "Auteur",
      accessorKey: "auteur",
      sortable: true,
      cell: (info) => truncateText(info.getValue(), 20),
    },
    {
      header: "Année",
      accessorKey: "annee",
      sortable: true,
      cell: (info) => truncateText(info.getValue(), 20),
    },
    {
      header: "Genre",
      accessorKey: "genre",
      sortable: true,
      cell: (info) => truncateText(info.getValue(), 20),
    },
    {
      header: "Sujet",
      accessorKey: "sujet",
      sortable: true,
      cell: (info) => truncateText(info.getValue(), 20),
    },
    {
      header: "Disponibilité",
      accessorKey: "disponible",
      cell: (info) => (
        <span
          className={
            info.getValue()
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {info.getValue() ? "Disponible" : "Indisponible"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={() => {
              setSelectedBook(row.original);
              setDetailModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-800 cursor-pointer p-1"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer p-1"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setDeleteModalOpen(true);
              setIdLivre(row.original.id);
            }}
            className="text-red-500 hover:text-red-700 cursor-pointer p-1"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: livreAll || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages || 1,
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full overflow-x-auto">
      <TableFilters
        search={search}
        setSearch={(value) => setSearch(value.toLowerCase())} // Recherche insensible à la casse
        genre={genre}
        setGenre={setGenre}
        disponibilite={disponibilite}
        setDisponibilite={setDisponibilite}
        handleReset={handleReset}
        setPage={setPage}
      />
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 border-b cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <Loading />
              </td>
            </tr>
          ) : livreAll.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Aucun livre trouvé
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex sm:justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Afficher :</span>
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
            className="px-4 py-2 border rounded disabled:opacity-50 whitespace-nowrap"
          >
            Précédent
          </button>
          <span className="whitespace-nowrap">
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

      {editModalOpen && selectedBook && (
        <EditModal
          book={selectedBook}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedBook(null);
          }}
          onSave={handleSaveEdit}
          editModalOpen={editModalOpen}
        />
      )}

      {deleteModalOpen && (
        <ConfirmationModal
          onClose={() => {
            setDeleteModalOpen(false);
            setIdLivre(null);
          }}
          onConfirm={confirmDelete}
          message="Êtes-vous sûr de vouloir supprimer ce livre ?"
        />
      )}

      {detailModalOpen && selectedBook && (
        <DetailModal
          book={selectedBook}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedBook(null);
          }}
          onEdit={handleEdit}
          onDelete={() => {
            setDeleteModalOpen(true);
            setIdLivre(selectedBook.id);
          }}
        />
      )}
    </div>
  );
}
