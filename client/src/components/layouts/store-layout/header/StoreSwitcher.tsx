'use client';

import { ChevronsUpDown, Plus, StoreIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { CreateStoreModal } from '@/components/modals/CreateStoreModal';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { IStore } from '@/shared/types/store.interface';

import { STORE_URL } from '@/config/url.config';

interface StoreSwitcherProps {
    items: IStore[];
}

export const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const onStoreSelect = (storeId: string) => {
        setIsOpen(false);
        router.push(STORE_URL.home(storeId));
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    role='combobox'
                    aria-label='select store'
                    className='w-52 cursor-pointer'
                >
                    <StoreIcon className='mr-2 size-4' />
                    Current store
                    <ChevronsUpDown className='ml-auto size-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>

            <PopoverContent className='w-52 p-0'>
                <Command>
                    <CommandList>
                        <CommandInput placeholder='Find a store...' />

                        <CommandEmpty>Nothing found</CommandEmpty>

                        <CommandGroup heading='Stores'>
                            {items.map(store => (
                                <CommandItem
                                    key={store.id}
                                    onSelect={() => onStoreSelect(store.id)}
                                    className='text-sm'
                                >
                                    <StoreIcon className='mr-2 size-4' />

                                    <div className='line-clamp-1'>
                                        {store.title}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CreateStoreModal>
                                <CommandItem>
                                    <Plus className='mr-2 size-4' />
                                    Create a store
                                </CommandItem>
                            </CreateStoreModal>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
