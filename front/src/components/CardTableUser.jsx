import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import TableFilterUser from "./TableFilterUser";
import Loading from "../pages/Loading/Loading";
import { useLibrairie } from "../context/LibrairieContext";
import UserDetailModal from "./UserDetailModal";
import UserStatusModal from "./UserStatusModal";
import UserDeleteModal from "./UserDeleteModal";

export default function CardTableUser({
  userAvecFiltre: users,
  limit,
  setLimit,
  page,
  setPage,
  handleReset,
}) {
  const {
    loading,
    totalPages,
    search,
    setSearch,
    fetchUsers,
    typeUser,
    setTypeUser,
    disponibilite,
    setDisponibilite,
  } = useLibrairie();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idUser, setIdUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setStatusModalOpen(true);
  };

  const { token } = useAuth();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user_filter"));
    if (storedData) {
      setPage(storedData.page || 1);
      setLimit(storedData.limit || 10);
      setSearch(storedData.search || "");
      setTypeUser(storedData.typeUser || "");
      setDisponibilite(storedData.disponibilite || "");
    }
  }, [setPage, setLimit, setSearch, setTypeUser, setDisponibilite]);

  useEffect(() => {
    localStorage.setItem(
      "user_filter",
      JSON.stringify({ page, limit, search, typeUser, disponibilite })
    );
  }, [page, limit, search, typeUser, disponibilite]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, search, typeUser, disponibilite, page, limit, fetchUsers]);

  const truncateText = (text, length = 20) =>
    text
      ? text.length > length
        ? text.substring(0, length) + "..."
        : text
      : "";

  const columns = [
    {
      id: "nom",
      header: "Nom",
      accessorKey: "nom",
      sortable: true,
      cell: (info) => truncateText(info.getValue()),
    },
    {
      id: "prenom",
      header: "Prénom",
      accessorKey: "prenom",
      sortable: true,
      cell: (info) => truncateText(info.getValue()),
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      sortable: true,
      cell: (info) => truncateText(info.getValue()),
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      sortable: true,
      cell: (info) => truncateText(info.getValue()),
    },
    {
      id: "totalEmprunts",
      header: "Total Emprunts",
      accessorKey: "emprunts",
      sortable: true,
      cell: (info) => info.getValue().length,
    },
    {
      id: "empruntsEnCours",
      header: "Emprunts en Cours",
      accessorKey: "emprunts",
      sortable: true,
      cell: (info) =>
        info.getValue().filter((emprunt) => emprunt.status === "En cours")
          .length,
    },
    {
      id: "empruntsEnRetard",
      header: "Emprunts en Retard",
      accessorKey: "emprunts",
      sortable: true,
      cell: (info) => {
        const currentDate = new Date();
        return info
          .getValue()
          .filter(
            (emprunt) =>
              emprunt.status === "En cours" &&
              new Date(emprunt.date_retour_prevue) < currentDate &&
              !emprunt.date_retour_reelle
          ).length;
      },
    },
    {
      id: "reservationsEnCours",
      header: "Réservations en Cours",
      accessorKey: "reservations",
      sortable: true,
      cell: (info) =>
        info
          .getValue()
          .filter((reservation) => reservation.status === "En attente").length,
    },
    {
      id: "dateInscription",
      header: "Date d'Inscription",
      accessorKey: "createdAt",
      sortable: true,
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      id: "compteActif",
      header: "Compte Actif",
      accessorKey: "isActive",
      cell: (info) => (
        <span
          className={
            info.getValue()
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {info.getValue() ? "Activer" : "Desactiver"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={() => {
              setSelectedUser(row.original);
              setDetailModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-800 p-1 cursor-pointer"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-500 hover:text-blue-700 p-1 cursor-pointer"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => {
              setDeleteModalOpen(true);
              setIdUser(row.original.id);
            }}
            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages || 1,
  });

  return (
    <div>
      {loading && <Loading />}
      <TableFilterUser
        search={search}
        setSearch={(value) => setSearch(value.toLowerCase())}
        typeUser={typeUser}
        setTypeUser={setTypeUser}
        handleReset={handleReset}
        setPage={setPage}
        disponibilite={disponibilite}
        setDisponibilite={setDisponibilite}
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg min-w-[600px]">
          <thead className="text-start bg-gray-100 text-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-start p-3 border-b cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ??
                      null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3 border-b whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <span>Afficher :</span>
          <select
            className="border rounded px-2 py-1"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
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

      <UserDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        user_id={selectedUser?.id}
        handleEdit={handleEdit}
        handleDelete={(id) => {
          setIdUser(id);
          setDeleteModalOpen(true);
        }}
      />

      <UserStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        user_id={selectedUser?.id}
        onSave={(id, data) => updateUser(data, id)} // tu appelles ta fonction updateUser
        fetchUsers={fetchUsers}
      />

      <UserDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        user_id={selectedUser?.id}
        onSave={(id, data) => updateUser(data, id)}
      />
    </div>
  );
}
