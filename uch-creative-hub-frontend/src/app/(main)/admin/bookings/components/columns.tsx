// src/app/(main)/admin/bookings/components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Booking } from "@/_services/booking.service"
import { Badge } from "@/components/ui/badge"
import { DataTableRowActions } from "./data-table-row-actions"
import { Button } from "@/components/ui/button" // Impor Button
import { ArrowUpDown, User, Calendar, MapPin, Activity } from "lucide-react" // Impor ikon

export const columns: ColumnDef<Booking>[] = [
    {
        // Ubah accessorKey agar sesuai dengan UI filter
        accessorKey: "user_name",
        // Gabungkan data nama dari objek user
        accessorFn: row => row.user.name,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-slate-100 text-slate-700 font-semibold p-0 h-auto"
            >
              <User className="mr-2 h-4 w-4" />
              Nama Pengguna
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const name = row.getValue("user_name") as string;
            return (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <span className="font-medium text-slate-800">{name}</span>
              </div>
            );
        },
    },
    {
        accessorKey: "room",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-slate-100 text-slate-700 font-semibold p-0 h-auto"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Ruangan
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const room = row.getValue("room") as string;
            return (
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                <span className="font-medium text-slate-700">{room}</span>
              </div>
            );
        },
    },
    {
        accessorKey: "bookingDate",
        // Tambahkan header khusus untuk sorting
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-slate-100 text-slate-700 font-semibold p-0 h-auto"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Tanggal Booking
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("bookingDate"));
            return (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-700" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800">
                    {new Intl.DateTimeFormat("id-ID", {
                        day: 'numeric', month: 'short', year: 'numeric'
                    }).format(date)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Intl.DateTimeFormat("id-ID", {
                        weekday: 'long'
                    }).format(date)}
                  </span>
                </div>
              </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-slate-100 text-slate-700 font-semibold p-0 h-auto"
            >
              <Activity className="mr-2 h-4 w-4" />
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
            let bgColor = "bg-slate-100";
            let textColor = "text-slate-700";

            if (status === "Approved") {
                variant = "secondary";
                bgColor = "bg-green-100";
                textColor = "text-green-800";
            }
            if (status === "Rejected") {
                variant = "destructive";
                bgColor = "bg-red-100";
                textColor = "text-red-800";
            }
            if (status === "Checked-in") {
                variant = "default";
                bgColor = "bg-blue-100";
                textColor = "text-blue-800";
            }
            if (status === "Pending") {
                bgColor = "bg-yellow-100";
                textColor = "text-yellow-800";
            }
            
            return (
              <Badge 
                variant={variant} 
                className={`${bgColor} ${textColor} border-0 font-medium px-3 py-1 rounded-lg`}
              >
                {status}
              </Badge>
            );
        }
    },
    {
        id: "actions",
        enableHiding: false,
        header: "Aksi",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]