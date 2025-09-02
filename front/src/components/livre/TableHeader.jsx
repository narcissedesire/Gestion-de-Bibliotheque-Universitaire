import React from "react";

export default function TableHeader({ table }) {
  return (
    <thead className="bg-gray-100 text-gray-700">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="p-3 border-b cursor-pointer"
              onClick={header.column.getToggleSortingHandler()}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
              {{
                asc: " 🔼",
                desc: " 🔽",
              }[header.column.getIsSorted()] ?? null}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
