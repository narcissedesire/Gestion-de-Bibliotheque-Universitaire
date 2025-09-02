import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function TableBody({
  loading,
  livreAll,
  table,
  handleEdit,
  handleDelete,
}) {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={6} className="text-center py-4">
            Chargement...
          </td>
        </tr>
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
            <td className="p-3 border-b">
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(row.original)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(row.original)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
