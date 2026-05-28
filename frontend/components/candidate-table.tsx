"use client";

import Link from "next/link";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import type { Candidate } from "@/lib/types";

const columns: ColumnDef<Candidate>[] = [
  {
    header: "Candidate",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <Link href={`/candidates/${row.original.id}`} className="text-white hover:text-cyan-200">
          {row.original.name}
        </Link>
        <span className="text-xs text-white/50">{row.original.role}</span>
      </div>
    )
  },
  {
    header: "Location",
    accessorKey: "location"
  },
  {
    header: "Semantic",
    cell: ({ row }) => `${Math.round(row.original.scores.semanticMatch * 100)}%`
  },
  {
    header: "Behavioral",
    cell: ({ row }) => `${Math.round(row.original.scores.behavioralScore * 100)}%`
  },
  {
    header: "Final Score",
    cell: ({ row }) => (
      <span className="font-semibold text-cyan-200">
        {Math.round(row.original.scores.finalScore * 100)}
      </span>
    )
  }
];

export default function CandidateTable({ data }: { data: Candidate[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          {table.getHeaderGroups()[0].headers.map((header) => (
            <TableHeaderCell key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
