"use client";

import { useState, useMemo } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  title?: string;
  icon?: string;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  title,
  icon,
  defaultSortKey,
  defaultSortDir = "desc",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let items = [...data];
    if (search && searchKeys) {
      const q = search.toLowerCase();
      items = items.filter((item) =>
        searchKeys.some((key) => {
          const val = (item as Record<string, unknown>)[key];
          return val !== undefined && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      items.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return items;
  }, [data, search, sortKey, sortDir, searchKeys]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  return (
    <div className="mb-4">
      {title && (
        <h5 className="section-title">
          {icon && `${icon} `}{title}
        </h5>
      )}
      <div className="stats-card p-3">
        {/* Search & Info Bar */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="text-muted small">
            Showing {paginated.length} of {filtered.length} entries
            {search && ` (filtered from ${data.length})`}
          </div>
          {searchable && searchKeys && (
            <input
              type="text"
              className="form-control form-control-sm search-input"
              style={{ maxWidth: "250px" }}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          )}
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      cursor: col.sortable ? "pointer" : "default",
                      width: col.width,
                      textAlign: col.align || "left",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="ms-1">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                    {col.sortable && sortKey !== col.key && (
                      <span className="ms-1 text-muted">⇅</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center text-muted py-4">
                    No data found
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ textAlign: col.align || "left" }}
                      >
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
              Page {page + 1} of {totalPages}
            </div>
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-secondary"
                disabled={page === 0}
                onClick={() => setPage(0)}
              >
                ««
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                «
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (page < 3) {
                  pageNum = i;
                } else if (page > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`btn ${page === pageNum ? "btn-outline-danger" : "btn-outline-secondary"}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                className="btn btn-outline-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                »
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(totalPages - 1)}
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}