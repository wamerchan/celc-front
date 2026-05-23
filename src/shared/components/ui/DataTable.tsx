
import React, { useState, useMemo } from 'react';

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  emptyTitle?: string;
  emptyDescription?: string;
  actions?: (item: T) => React.ReactNode;
  rowKey: (item: T) => string | number;
}

function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[var(--color-text-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="font-semibold text-[var(--color-text)] mb-1">{title}</p>
      {description && <p className="text-sm text-[var(--color-text-muted)]">{description}</p>}
    </div>
  );
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded-md shimmer-bg" style={{ width: `${60 + (i % 3) * 15}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  searchFields,
  emptyTitle = 'Sin resultados',
  emptyDescription = 'No se encontraron registros.',
  actions,
  rowKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    const fields = searchFields ?? (columns.map(c => c.key) as (keyof T)[]);
    return data.filter(item =>
      fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
    );
  }, [data, search, searchFields, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
    setPage(1);
  };

  const allColumns = actions
    ? [...columns, { key: '__actions', header: 'Acciones', sortable: false }]
    : columns;

  return (
    <div className="rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-surface)]/75 backdrop-blur-md overflow-hidden shadow-lg">
      {searchable && (
        <div className="px-5 py-4 border-b border-[var(--color-border)]/80 bg-[var(--color-surface-2)]/20">
          <div className="relative max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]/80 bg-[var(--color-surface-2)]/30">
              {allColumns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  onClick={() => col.sortable !== false && col.key !== '__actions' && handleSort(col.key)}
                  className={[
                    'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]',
                    col.sortable !== false && col.key !== '__actions' ? 'cursor-pointer select-none hover:text-[var(--color-text)] transition-colors' : '',
                  ].join(' ')}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && col.key !== '__actions' && (
                      <svg className={`w-3 h-3 transition-transform ${sortKey === col.key ? 'text-emerald-500' : 'text-[var(--color-text-subtle)]'} ${sortKey === col.key && !sortAsc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={allColumns.length} />)
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              paginated.map(item => (
                <tr
                  key={rowKey(item)}
                  className="hover:bg-[var(--color-surface-2)]/30 transition-all duration-150 group/row border-l-2 border-l-transparent hover:border-l-emerald-500"
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-[var(--color-text)]">
                      {col.render ? col.render(item) : String(item[col.key] ?? '-')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[var(--color-border)]/80 bg-[var(--color-surface-2)]/20">
          <p className="text-xs text-[var(--color-text-muted)]">
            Página <span className="font-medium text-[var(--color-text)]">{page}</span> de{' '}
            <span className="font-medium text-[var(--color-text)]">{totalPages}</span>{' '}
            · <span className="font-medium text-[var(--color-text)]">{sorted.length}</span> resultados
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-700/50 bg-transparent text-[var(--color-text)] hover:bg-slate-800/40 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-700/50 bg-transparent text-[var(--color-text)] hover:bg-slate-800/40 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
