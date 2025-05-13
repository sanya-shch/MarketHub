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

export interface ICategoryColumn {
    id: string;
    createdAt: string;
    title: string;
    storeId: string;
}

export const categoryColumns: ColumnDef<ICategoryColumn>[] = [
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
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Date of creation
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
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

                    <Link href={PUBLIC_URL.category(row.original.id)}>
                        <DropdownMenuItem>
                            <ExternalLink className='size-4 mr-2' />
                            Category page
                        </DropdownMenuItem>
                    </Link>

                    <Link
                        href={STORE_URL.categoryEdit(
                            row.original.storeId,
                            row.original.id,
                        )}
                    >
                        <DropdownMenuItem>
                            <Pencil className='size-4 mr-2' />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
