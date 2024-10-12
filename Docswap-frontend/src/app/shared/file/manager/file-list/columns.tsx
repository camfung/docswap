'use client';

import Image from 'next/image';
import dayjs from 'dayjs';
import {
  PiCopySimple,
  PiDotsThreeOutlineVerticalFill,
  PiShareFat,
  PiTrashSimple,
} from 'react-icons/pi';
import { HeaderCell } from '@/components/ui/table';
import { Title, Text, Checkbox, ActionIcon, Button, Popover, Badge } from 'rizzui';
import Favorite from '@/app/shared/file/manager/favorite';
import pdfIcon from '@public/pdf-icon.svg';
import { Document } from '@/types';
import { formatDate, formatDateFromString } from '@/utils/format-date';

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
      <div className="ps-2">
        <Checkbox
          className="cursor-pointer"
          checked={checkedItems.length === data.length}
          onChange={handleSelectAll}
        />
      </div>
    ),
    dataIndex: 'checked',
    key: 'checked',
    width: 40,
    render: (_: any, row: any) => (
      <div className="inline-flex ps-2">
        <Checkbox
          className="cursor-pointer"
          checked={checkedItems.includes(`${row.ID}`)}
          {...(onChecked && { onChange: () => onChecked(`${row.ID}`) })}
        />
      </div>
    ),
  },
  {
    title: <HeaderCell title="Name" />,
    dataIndex: 'FileName',
    key: 'FileName',
    width: 170,
    render: (file: any, row: any) => (
      <div className="flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
          <Image
            src={pdfIcon}
            className="aspect-square"
            width={26}
            height={26}
            alt=""
          />
        </div>
        <div className="ml-3 rtl:ml-0 rtl:mr-3">
          <Title as="h6" className="mb-0.5 !text-sm font-medium">
            {file}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="Description" />,
    dataIndex: 'Description',
    key: 'Description',
    width: 180,
    render: (value: any) => (
      <span className="capitalize text-gray-500">{value}</span>
    ),
  },
  {
    title: <HeaderCell title="Address" />,
    dataIndex: 'Address',
    key: 'Address',
    width: 130,
    render: (value: any) => (
      <span className="capitalize text-gray-500">{value}</span>
    ),
  },
  {
    title: <HeaderCell title="Category" />,
    dataIndex: 'Category',
    key: 'Category',
    width: 80,
    render: (_: any, row: any) => (
      <span className="capitalize text-gray-500">{row?.Category?.Name}</span>
    ),
  },
  {
    title: <HeaderCell title="Uploaded On" />,
    dataIndex: 'UploadedAt',
    key: 'UploadedAt',
    width: 60,
    render: (value: any) => (
      <span className="capitalize text-gray-500">{formatDateFromString(value, "MMM DD, YYYY")}</span>
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
    title: <></>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3">
        <Favorite />
        <Popover placement="left">
          <Popover.Trigger>
            <ActionIcon variant="text">
              <PiDotsThreeOutlineVerticalFill className="h-[18px] w-[18px] text-gray-500" />
            </ActionIcon>
          </Popover.Trigger>
          <Popover.Content className="z-0 min-w-[140px] px-2 dark:bg-gray-100 [&>svg]:dark:fill-gray-100">
            <div className="text-gray-900">
              <Button
                variant="text"
                className="flex w-full items-center justify-start px-2 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-50"
              >
                <PiCopySimple className="mr-2 h-5 w-5 text-gray-500" />
                Copy
              </Button>
              <Button
                variant="text"
                className="flex w-full items-center justify-start px-2 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-50"
              >
                <PiShareFat className="mr-2 h-5 w-5 text-gray-500" />
                Share
              </Button>
              <Button
                variant="text"
                className="flex w-full items-center justify-start px-2 py-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-50"
                onClick={() => onDeleteItem(row.id)}
              >
                <PiTrashSimple className="mr-2 h-5 w-5 text-gray-500" />
                Delete
              </Button>
            </div>
          </Popover.Content>
        </Popover>
      </div>
    ),
  },
];
