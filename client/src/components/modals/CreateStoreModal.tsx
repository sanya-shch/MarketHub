import { PropsWithChildren, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useCreateStore } from '@/hooks/queries/store/useCreateStore';

import { IStoreCreate } from '@/shared/types/store.interface';

import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export function CreateStoreModal({ children }: PropsWithChildren<unknown>) {
    const [isOpen, setIsOpen] = useState(false);

    const { createStore, isLoadingCreate } = useCreateStore();

    const form = useForm<IStoreCreate>({
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<IStoreCreate> = data => {
        createStore(data);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className='w-full'>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Store creation</DialogTitle>
                    <DialogDescription>
                        To create a store you must specify a name
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='title'
                            rules={{
                                required: 'Title is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder='Store title'
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end'>
                            <Button
                                variant='primary'
                                disabled={isLoadingCreate}
                                className='cursor-pointer'
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
