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

function NewlineText({ text = '' }) {
    return (
        <div className="leading-7">
            {text.split('\n').map((line, index) => (
                <span key={index}>
                    {line}
                    <br />
                </span>
            ))}
        </div>
    );
}

export default function DataTableDemo({ data = [], loadedTable }) {
    console.log(data);
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
                    accessorKey: "TotalFacilities",
                    id: "Total Facilities",
                    header: ({ column }) => <ColumnHeader column={column} title="Total Facilities" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Total Facilities")}</div>,
                    size: 120,
                    enableSorting: true
                },
                {
                    accessorKey: "Assessed",
                    id: "Assessed",
                    header: ({ column }) => <ColumnHeader column={column} title="Assessed" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Assessed")}</div>,
                    size: 120,
                    enableSorting: true
                },
                {
                    accessorKey: "PercentageComplete",
                    id: "Percentage Complete",
                    header: ({ column }) => <ColumnHeader column={column} title="Percentage Complete" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Percentage Complete")}</div>,
                    size: 120,
                    enableSorting: true
                },
                {
                    accessorKey: "Duplicates",
                    id: "Duplicates",
                    header: ({ column }) => <ColumnHeader column={column} title="Duplicates" />,
                    cell: ({ row }) => <div className="capitalize">{row.getValue("Duplicates")}</div>,
                    size: 100,
                    enableSorting: true
                }
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
                    <div className="flex items-center py-4 min-w-[300px]">
                        {loadedTable
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
                        <p className="p-10 text-gray-700">No Data Uploaded</p>
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
                                <TableHead key={header.id} >
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
                                        {
                                            !row.getIsExpanded()
                                                ?
                                                (<div className="max-h-[200px] overflow-hidden">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </div>)
                                                :
                                                flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )
                                        }
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