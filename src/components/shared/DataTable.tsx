import React, { useState, useMemo } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface DataTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const DataTable = ({ headers, data, renderRow, searchable, searchPlaceholder }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchable]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      {searchable && (
        <div className="mb-4">
          <Input
            type="text"
            placeholder={searchPlaceholder || 'Buscar...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((item, index) => (
              <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando {paginatedData.length} de {filteredData.length} resultados
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;