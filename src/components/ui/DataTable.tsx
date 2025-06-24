import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface ColumnDefinition {
  key: string
  label: string
  render?: (value: any, row?: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: ColumnDefinition[]
  showActions?: boolean
  loading?: boolean
  rowsPerPage?: number
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  showActions = false,
  loading = false,
  rowsPerPage = 5
}) => {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)

  const filteredData = useMemo(() => {
    let filtered = data.filter((row) =>
      columns.some((col) =>
        String(row[col.key]).toLowerCase().includes(search.toLowerCase())
      )
    )

    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, columns, search, sortBy, sortDirection])

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const handleSort = (colKey: string) => {
    if (sortBy === colKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(colKey)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none"
                >
                  {col.label}
                  {sortBy === col.key ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
                </TableHead>
              ))}
              {showActions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-100">
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </TableCell>
                    ))}
                    {showActions && (
                      <TableCell>
                        <Link to={`/agent/${row.agent_id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
