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

import { useCreateColor } from '@/hooks/queries/colors/useCreateColor';
import { useDeleteColor } from '@/hooks/queries/colors/useDeleteColor';
import { useUpdateColor } from '@/hooks/queries/colors/useUpdateColor';

import { IColor, IColorInput } from '@/shared/types/color.interface';

interface ColorFormProps {
    color?: IColor;
}

export const ColorForm = ({ color }: ColorFormProps) => {
    const { createColor, isLoadingCreate } = useCreateColor();
    const { updateColor, isLoadingUpdate } = useUpdateColor();
    const { deleteColor, isLoadingDelete } = useDeleteColor();

    const title = color ? 'Change data' : 'Create color';
    const description = color ? 'Change color data' : 'Add new color to store';
    const action = color ? 'Save' : 'Create';

    const form = useForm<IColorInput>({
        mode: 'onChange',
        values: {
            name: color?.name || '',
            value: color?.value || '',
        },
    });

    const onSubmit: SubmitHandler<IColorInput> = data => {
        if (color) updateColor(data);
        else createColor(data);
    };

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />

                {color && (
                    <ConfirmModal handleClick={deleteColor}>
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
                            name='name'
                            rules={{
                                required: 'Name is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder='Color name'
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

                        <FormField
                            control={form.control}
                            name='value'
                            rules={{
                                required: 'Value is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder='Color value'
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
