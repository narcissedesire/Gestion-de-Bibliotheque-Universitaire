import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLibrairie } from "../../context/LibrairieContext";
import TableFilters from "./TableFilters";
import EditModal from "./EditModal";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../pages/Loading/Loading";

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
    deleteLivre, // Nouvelle fonction depuis LibrairieContext
  } = useLibrairie();

  const { token } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [idLivre, setIdLivre] = useState(null);

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
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "livreFilters",
      JSON.stringify({ page, limit, search, genre, disponibilite })
    );
  }, [page, limit, search, genre, disponibilite]);

  // Appliquer le filtre si filterGenre est fourni
  if (filterGenre && genre !== filterGenre) {
    setGenre(filterGenre);
    setPage(1);
  }

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
    console.log("Ebook: ", book);
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteLivre(idLivre); // Utilisation de la fonction centralisée
      toast.success("Livre supprimé avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la suppression du livre.");
    }
    setDeleteModalOpen(false);
  };

  const handleSaveEdit = async (updatedBook) => {
    try {
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du livre.");
    }
    setEditModalOpen(false);
  };

  // Configuration de la table avec useReactTable
  const columns = [
    { header: "Titre", accessorKey: "titre", sortable: true },
    { header: "Auteur", accessorKey: "auteur", sortable: true },
    { header: "Année", accessorKey: "annee", sortable: true },
    { header: "Genre", accessorKey: "genre", sortable: true },
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
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer p-1"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              // handleDelete(row.original.id);
              setDeleteModalOpen(true);
              setIdLivre(row.original.id);

              console.log(row.original.id);
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
    data: livreAll,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full overflow-x-auto">
      <TableFilters
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        disponibilite={disponibilite}
        setDisponibilite={setDisponibilite}
        handleReset={handleReset}
        setPage={setPage} // Passage de setPage pour gérer la réinitialisation de la page dans les filtres
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
            <Loading />
          ) : livreAll.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Aucun livre trouvé
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
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
      {editModalOpen && selectedBook && (
        <EditModal
          book={selectedBook}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          editModalOpen={editModalOpen}
        />
      )}
      {deleteModalOpen && (
        <ConfirmationModal
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message="Êtes-vous sûr de vouloir supprimer ce livre ?"
        />
      )}
    </div>
  );
}
