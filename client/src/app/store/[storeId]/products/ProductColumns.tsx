import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    ExternalLink,
    MoreHorizontal,
    Pencil,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { PUBLIC_URL, STORE_URL } from '@/config/url.config';

export interface IProductColumn {
    id: string;
    title: string;
    price: string;
    category: string;
    color: string;
    storeId: string;
}

export const productColumns: ColumnDef<IProductColumn>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Title
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Price
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
    },
    {
        accessorKey: 'category',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Category
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
    },
    {
        accessorKey: 'color',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Color
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => (
            <div className='flex items-center gap-x-3'>
                {row.original.color}

                <div
                    className='size-5 rounded-full border'
                    style={{ backgroundColor: row.original.color }}
                />
            </div>
        ),
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <Link href={PUBLIC_URL.product(row.original.id)}>
                        <DropdownMenuItem>
                            <ExternalLink className='size-4 mr-2' />
                            Product page
                        </DropdownMenuItem>
                    </Link>

                    <Link
                        href={STORE_URL.productsEdit(
                            row.original.storeId,
                            row.original.id,
                        )}
                    >
                        <DropdownMenuItem>
                            <Pencil className='size-4 mr-2' />
                            Update
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
