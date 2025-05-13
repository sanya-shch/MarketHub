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

import { useCreateCategory } from '@/hooks/queries/categories/useCreateCategory';
import { useDeleteCategory } from '@/hooks/queries/categories/useDeleteCategory';
import { useUpdateCategory } from '@/hooks/queries/categories/useUpdateCategory';

import { ICategory, ICategoryInput } from '@/shared/types/category.interface';

interface CategoryFormProps {
    category?: ICategory;
}

export const CategoryForm = ({ category }: CategoryFormProps) => {
    const { createCategory, isLoadingCreate } = useCreateCategory();
    const { updateCategory, isLoadingUpdate } = useUpdateCategory();
    const { deleteCategory, isLoadingDelete } = useDeleteCategory();

    const title = category ? 'Change data' : 'Create category';
    const description = category
        ? 'Change category data'
        : 'Add new category to store';
    const action = category ? 'Save' : 'Create';

    const form = useForm<ICategoryInput>({
        mode: 'onChange',
        values: {
            title: category?.title || '',
            description: category?.description || '',
        },
    });

    const onSubmit: SubmitHandler<ICategoryInput> = data => {
        if (category) updateCategory(data);
        else createCategory(data);
    };

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />

                {category && (
                    <ConfirmModal handleClick={deleteCategory}>
                        <Button
                            size='icon'
                            variant='primary'
                            disabled={isLoadingDelete}
                            className='flex items-center gap-x-4'
                        >
                            <Trash className='size-4' />
                        </Button>
                    </ConfirmModal>
                )}
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
                                required: 'Title is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder='Category title'
                                            disabled={
                                                isLoadingCreate ||
                                                isLoadingUpdate
                                            }
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
                        rules={{
                            required: 'Description is required',
                        }}
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

                    <Button
                        variant='primary'
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {action}
                    </Button>
                </form>
            </Form>
        </div>
    );
};
