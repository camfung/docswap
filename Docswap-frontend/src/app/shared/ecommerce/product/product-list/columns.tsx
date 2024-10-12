'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HeaderCell } from '@/components/ui/table';
import {
  Badge,
  Text,
  Checkbox,
  Progressbar,
  Tooltip,
  ActionIcon,
} from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import AvatarCard from '@/components/ui/avatar-card';
import { ProductType } from '@/data/products-data';
import { PiStarFill } from 'react-icons/pi';
import DeletePopover from '@/app/shared/delete-popover';
import { Document } from '@/types';
import pdfIcon from '@public/pdf-icon.svg';

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
}: Columns) => [
  {
    title: (
      <div className="ps-3.5">
        <Checkbox
          title={'Select All'}
          onChange={handleSelectAll}
          checked={checkedItems.length === data.length}
          className="cursor-pointer"
        />
      </div>
    ),
    dataIndex: 'checked',
    key: 'checked',
    width: 30,
    render: (_: any, row: any) => (
      <div className="inline-flex ps-3.5">
        <Checkbox
          className="cursor-pointer"
          checked={checkedItems.includes(row.ID)}
          {...(onChecked && { onChange: () => onChecked(row.ID) })}
        />
      </div>
    ),
  },
  {
    dataIndex: 'Icon',
    key: 'icon',
    width: 20,
    render: () => (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <Image
            src={pdfIcon}
            className="aspect-square"
            width={26}
            height={26}
            alt=""
          />
        </div>
    )
  },
  {
    title: <HeaderCell title="Document" />,
    dataIndex: 'FileName',
    key: 'document',
    width: 300,
    render: (_: string, row: Document) => (
      <div>
        <Text className="text-sm font-semibold text-gray-900">{row.FileName}</Text>
        {
          (row.Description ?? '').length > 0 && (
            <Text className="text-sm text-gray-500">{row.Description}</Text>
          )
        }
      </div>
    ),
  },
  {
    title: <HeaderCell title="Address" />,
    dataIndex: 'Address',
    key: 'address',
    width: 200,
    render: (address: string) => (
      <Text className="text-sm font-semibold text-gray-900">{address}</Text>
    ),
  },
  {
    title: <HeaderCell title="Category" />,
    dataIndex: 'Category',
    key: 'category',
    width: 100,
    render: (category: any) => (
      <Text className="text-sm font-semibold text-gray-900">{category.Name}</Text>
    ),
  },
  {
    title: (
      <HeaderCell
        title="Credits Required"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'price'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('price'),
    dataIndex: 'CreditValue',
    key: 'price',
    width: 50,
    render: (creditValue: number) => (
      <Text className="font-medium text-gray-700">{creditValue} </Text>
    ),
  },
  {
    title: <HeaderCell title="Tags" />,
    dataIndex: 'Tags',
    key: 'Tags',
    width: 120,
    render: (_: any, document: any) => (
      <div className="flex flex-wrap items-center gap-1">
        {document?.Tags?.map((document_tag: any) => {
          const tag = document_tag?.Tag;
          return (
            <Badge key={tag.ID} className="whitespace-nowrap">
              <Text className="whitespace-nowrap">
                {tag.Name}
              </Text>
            </Badge>
          );
        })}
      </div>
      ),
  },
  {
    // Need to avoid this issue -> <td> elements in a large <table> do not have table headers.
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 20,
    render: (_: string, row: ProductType) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip
          size="sm"
          content={'View Product'}
          placement="top"
          color="invert"
        >
          <Link href={routes.eCommerce.productDetails(row.id)}>
            <ActionIcon size="sm" variant="outline" aria-label={'View Product'}>
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
      </div>
    ),
  },
];
