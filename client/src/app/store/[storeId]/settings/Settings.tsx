'use client';

import { Trash } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useDeleteStore } from '@/hooks/queries/store/useDeleteStore';
import { useUpdateStore } from '@/hooks/queries/store/useUpdateStore';

import { IStoreEdit } from '@/shared/types/store.interface';

export const Settings = () => {
    const { store, updateStore, isLoadingUpdate } = useUpdateStore();
    const { deleteStore, isLoadingDelete } = useDeleteStore();

    const form = useForm<IStoreEdit>({
        mode: 'onChange',
        values: {
            title: store?.title || '',
            description: store?.description || '',
        },
    });

    const onSubmit: SubmitHandler<IStoreEdit> = data => {
        updateStore(data);
    };

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Settings' description='Manage store settings' />

                <ConfirmModal handleClick={deleteStore}>
                    <Button
                        size='icon'
                        variant='primary'
                        disabled={isLoadingDelete}
                        className='flex items-center gap-x-4'
                    >
                        <Trash className='size-4' />
                    </Button>
                </ConfirmModal>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6 h-full'
                >
                    <div className='grid sm:grid-cols-2 md:grid-col-2 lg:grid-cols-3 gap-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            rules={{
                                required: 'Title required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Title'
                                            disabled={isLoadingUpdate}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Description'
                                        disabled={isLoadingUpdate}
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button variant='primary' disabled={isLoadingUpdate}>
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    );
};
