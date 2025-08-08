// src/app/(main)/admin/bookings/components/data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Settings } from "lucide-react"
import { PDFExportButton } from "./pdf-export-button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // 1. State untuk sorting, filtering, dan visibility
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // 2. Hubungkan state dan fungsi ke tabel
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // 3. Inisialisasi state untuk tabel
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 mb-2">Daftar Booking</h2>
        <p className="text-sm lg:text-base text-slate-600">Kelola dan monitor semua booking ruangan</p>
      </div>

      {/* Bagian UI untuk Filter dan Pengaturan Kolom */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Cari berdasarkan nama pengguna..."
            value={(table.getColumn("user_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("user_name")?.setFilterValue(event.target.value)
            }
            className="pl-10 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <PDFExportButton 
            bookings={data as any} 
            filteredBookings={table.getFilteredRowModel().rows.map(row => row.original as any)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-slate-50 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Kolom 
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-slate-200">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize rounded-lg"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                  >
                    {column.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Tabel Data */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-200 bg-slate-50/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-slate-700 font-semibold py-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium">Tidak ada hasil ditemukan</p>
                    <p className="text-sm text-slate-400">Coba ubah kata kunci pencarian</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Bagian UI untuk Paginasi */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <div className="text-sm text-slate-600">
          Menampilkan{" "}
          <span className="font-medium">{table.getRowModel().rows.length}</span> dari{" "}
          <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> booking
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border-slate-200 hover:bg-slate-50"
          >
            Sebelumnya
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-slate-600">Halaman</span>
            <span className="text-sm font-medium text-slate-800">
              {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border-slate-200 hover:bg-slate-50"
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  )
}