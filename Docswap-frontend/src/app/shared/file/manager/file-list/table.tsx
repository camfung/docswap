'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTable } from '@/hooks/use-table';
import { Button } from 'rizzui';
import { useColumn } from '@/hooks/use-column';
import { getColumns } from '@/app/shared/file/manager/file-list/columns';
import FileFilters from '@/app/shared/file/manager/file-filters';
import ControlledTable from '@/components/controlled-table';
import axios from 'axios';
import { useDocuments } from '@/contexts/DocumentContext';
import { Document } from '@/types';
import { toast } from 'react-hot-toast';
const TableFooter = dynamic(() => import('@/app/shared/table-footer'), {
  ssr: false,
});

export default function FileListTable({ className }: { className?: string }) {
  const [pageSize, setPageSize] = useState(10);

  const { currentUserDocuments, fetchCurrentUserDocuments } = useDocuments();

  const onHeaderCellClick = (value: string) => ({
    onClick: () => {
      handleSort(value);
    },
  });

  const onDeleteItem = (id: string) => {
    handleDelete(id);
  };

  const downloadDocument = async (selectedDocument: any) => {
    try {
      const id = selectedDocument.ID;
      const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/document/${id}/download`;
      const response = await axios.get(url, {
        responseType: 'blob',
      });

      const objectUrl = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = selectedDocument.FileName; // Set the desired file name and extension
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const onDowloadDocument = () => {
    // change row keys back to integers
    const selectedRowKeysInt = selectedRowKeys.map((key: any) => parseInt(key));

    // get the selected documents
    const selectedDocuments = currentUserDocuments.filter((doc: any) =>
      selectedRowKeysInt.includes(doc.ID)
    );

    // download each document
    selectedDocuments.forEach(async (doc: any) => {
      await downloadDocument(doc);
    });
  }

  const onDeleteDocuments = async (ids: string[]) => {
    const idsInt = ids.map((id: string) => parseInt(id));
    const selectedDocumentIds = idsInt.map((id: number) => {
      return { ID: id };
    })
    
    const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/document/bulk`;

    try {
      toast.loading(`Archiving ${selectedDocumentIds.length} document${selectedDocumentIds.length > 1 ? 's' : ''}...`)

      await axios.delete(url, {
        data: selectedDocumentIds,
      });
    } catch (error) {
      console.error('Error deleting document:', error);
    }

    toast.dismiss();
    toast.success(`Document${selectedDocumentIds.length > 1 ? 's' : ''} archived successfully`);

    fetchCurrentUserDocuments(false, true);
  };

  useEffect(() => {
    fetchCurrentUserDocuments(false, true);
  }, [fetchCurrentUserDocuments]);

  const {
    isLoading,
    tableData,
    currentPage,
    totalItems,
    handlePaginate,
    filters,
    updateFilter,
    searchTerm,
    handleSearch,
    sortConfig,
    handleSort,
    selectedRowKeys,
    setSelectedRowKeys,
    handleRowSelect,
    handleSelectAll,
    handleDelete,
  } = useTable(currentUserDocuments, pageSize);

  const columns = useMemo(
    () =>
      getColumns({
        data: currentUserDocuments,
        sortConfig,
        checkedItems: selectedRowKeys,
        onHeaderCellClick,
        onDeleteItem,
        onChecked: handleRowSelect,
        handleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedRowKeys,
      onHeaderCellClick,
      sortConfig.key,
      sortConfig.direction,
      onDeleteItem,
      handleRowSelect,
      handleSelectAll,
    ]
  );

  const { visibleColumns } = useColumn(columns);

  return (
    <div className={className}>
      <FileFilters
        filters={filters}
        updateFilter={updateFilter}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      />
      <ControlledTable
        isLoading={isLoading}
        showLoadingText={true}
        data={tableData}
        // @ts-ignore
        columns={visibleColumns}
        scroll={{ x: 1300 }}
        variant="modern"
        tableLayout="fixed"
        rowKey={(record) => record.ID}
        paginatorOptions={{
          pageSize,
          setPageSize,
          total: totalItems,
          current: currentPage,
          onChange: (page: number) => handlePaginate(page),
        }}
        tableFooter={
          <TableFooter
            checkedItems={selectedRowKeys}
            handleDelete={(ids: string[]) => {
              setSelectedRowKeys([]);
              handleDelete(ids);
              onDeleteDocuments(ids);
            }}
          >
            <Button size="sm" className="dark:bg-gray-300 dark:text-gray-800" onClick={onDowloadDocument}>
              Download {selectedRowKeys.length}{' '}
              {selectedRowKeys.length > 1 ? 'Files' : 'File'}
            </Button>
          </TableFooter>
        }
      />
    </div>
  );
}
