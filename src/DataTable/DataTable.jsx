"use client"

import * as React from "react"
import { useState } from "react"

import {
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    useReactTable,
} from "@tanstack/react-table"

import Paginator from './table-components/paginator'
import ColumnHeader from './table-components/columnHeader'
import DataTableViewOptions from './table-components/dataTableViewOptions'

import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown } from "lucide-react"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


import { Spinner } from "@/components/ui/spinner.jsx"

export default function DataTableDemo({ data = [], loadedTable }) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [expanded, setExpanded] = useState({})

    const columns = React.useMemo(
        () => {
            if (!loadedTable) {
                return [];
            }

            return [
                {
                    accessorKey: "DistrictName",
                    header: ({ column }) => <ColumnHeader column={column} title="District" />,
                    id: "District",
                    cell: ({ row }) => (
                        <div className="">{row.getValue("District")}</div>
                    ),
                    size: 200,
                    enableSorting: true

                },
                {
                    accessorKey: "Level0",
                    id: "Level 0",
                    header: ({ column }) => <ColumnHeader className="bg-[#FF0000] text-black" column={column} title="Level 0" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Level 0")}</div>,
                    size: 100,
                    enableSorting: true
                },
                {
                    accessorKey: "Level1",
                    id: "Level 1",
                    header: ({ column }) => <ColumnHeader className="bg-[#FFC000] text-black" column={column} title="Level 1" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Level 1")}</div>,
                    size: 100,
                    enableSorting: true
                },
                {
                    accessorKey: "Level2",
                    id: "Level 2",
                    header: ({ column }) => <ColumnHeader className="bg-[#FFFF00] text-black" column={column} title="Level 2" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Level 2")}</div>,
                    size: 100,
                    enableSorting: true
                },
                {
                    accessorKey: "Level3",
                    id: "Level 3",
                    header: ({ column }) => <ColumnHeader className="bg-[#92D050] text-black" column={column} title="Level 3" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Level 3")}</div>,
                    size: 100,
                    enableSorting: true
                },
                {
                    accessorKey: "Level4",
                    id: "Level 4",
                    header: ({ column }) => <ColumnHeader className="bg-[#00B050] text-black" column={column} title="Level 4" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Level 4")}</div>,
                    size: 100,
                    enableSorting: true
                },
                {
                    id: "Level 5",
                    header: ({ column }) => <ColumnHeader className="pl-3" column={column} title="Total" />,
                    cell: ({ row }) => {

                        const level0 = row.getValue("Level 0");
                        const level1 = row.getValue("Level 1");
                        const level2 = row.getValue("Level 2");
                        const level3 = row.getValue("Level 3");
                        const level4 = row.getValue("Level 4");

                        const total = level0 + level1 + level2 + level3 + level4;

                        return (
                            <div className="capitalize">
                                {total}
                            </div>
                        )
                    },
                    size: 100,
                    enableSorting: true
                },
            ]
        },
        [loadedTable]
    )

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowCanExpand: (row) => true,
        initialState: {
            pagination: {
                pageSize: 10,
            }
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            expanded
        },
        onExpandedChange: setExpanded
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="flex items-center py-4 min-w-[300px] max-md:min-w-0">
                        {
                            loadedTable
                            &&
                            <Input
                                placeholder="Filter District..."
                                value={(table.getColumn("District")?.getFilterValue()) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("District")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        }
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {
                        loadedTable
                        &&
                        <>
                            <DataTableViewOptions table={table} />
                        </>
                    }
                </div>
            </div>
            <div className="rounded-md border max-w-[100%]">
                {
                    loadedTable
                        ?
                        <DataTable table={table} />
                        :

                        <p className="p-10 text-gray-700 flex items-center justify-center gap-3"> <Spinner /> Loading Data</p>
                }
            </div>
            {loadedTable
                &&
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Paginator table={table} />
                </div>
            }
        </div>
    )
}

function DataTable({ table }) {
    return (
        <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {

                            const { column } = header;
                            const minSize = header.getSize();
                            return (
                                <TableHead className="px-0" key={header.id} style={{ minWidth: minSize }} >
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
                {table?.getRowModel()?.rows?.length ? (
                    table?.getRowModel().rows.map((row) => {
                        return (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className="align-top" key={cell.id}>
                                        <div className="max-h-[200px] px-3 overflow-hidden">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        )
                    })
                ) : (
                    <TableRow>
                        <TableCell
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}