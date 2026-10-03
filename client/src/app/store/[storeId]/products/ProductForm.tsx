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
import { ImageUpload } from '@/components/ui/image-upload/ImageUpload';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { useCreateProduct } from '@/hooks/queries/products/useCreateProduct';
import { useDeleteProduct } from '@/hooks/queries/products/useDeleteProduct';
import { useUpdateProduct } from '@/hooks/queries/products/useUpdateProduct';

import { ICategory } from '@/shared/types/category.interface';
import { IColor } from '@/shared/types/color.interface';
import { IProduct, IProductInput } from '@/shared/types/product.interface';

interface ProductFormProps {
    product?: IProduct;
    categories: ICategory[];
    colors: IColor[];
}

export const ProductForm = ({
    product,
    categories,
    colors,
}: ProductFormProps) => {
    const { createProduct, isLoadingCreate } = useCreateProduct();
    const { updateProduct, isLoadingUpdate } = useUpdateProduct();
    const { deleteProduct, isLoadingDelete } = useDeleteProduct();

    const title = product ? 'Change data' : 'Create product';
    const description = product
        ? 'Change product data'
        : 'Add new product to store';
    const action = product ? 'Save' : 'Create';

    const form = useForm<IProductInput>({
        mode: 'onChange',
        values: {
            title: product?.title || '',
            description: product?.description || '',
            images: product?.images || [],
            price: product?.price || 0,
            categoryId: product?.category.id || '',
            colorId: product?.color.id || '',
        },
    });

    const onSubmit: SubmitHandler<IProductInput> = data => {
        data.price = Number(data.price);

        if (product) updateProduct(data);
        else createProduct(data);
    };

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />

                {product && (
                    <ConfirmModal handleClick={deleteProduct}>
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
                    <FormField
                        control={form.control}
                        name='images'
                        rules={{
                            required: 'Upload at least one image',
                        }}
                        render={({ field }) => (
                            <FormItem className='mt-4'>
                                <FormLabel>Images</FormLabel>

                                <FormControl>
                                    <ImageUpload
                                        isDisabled={
                                            isLoadingCreate || isLoadingUpdate
                                        }
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                            placeholder='Product title'
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
                            name='price'
                            rules={{
                                required: 'Price is required',
                                validate: value =>
                                    (Number.isInteger(Number(value)) &&
                                        Number(value) > 0) ||
                                    'Price must be a whole number greater than 0',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder='Product price'
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
                            name='categoryId'
                            rules={{
                                required: 'Category is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>

                                    <Select
                                        disabled={
                                            isLoadingCreate || isLoadingUpdate
                                        }
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Product category' />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map(category => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid sm:grid-cols-2 md:grid-col-2 lg:grid-cols-3 gap-4 mt-4'>
                        <FormField
                            control={form.control}
                            name='colorId'
                            rules={{
                                required: 'Color is required',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>

                                    <Select
                                        disabled={
                                            isLoadingCreate || isLoadingUpdate
                                        }
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Product color' />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectGroup>
                                                {colors.map(color => (
                                                    <SelectItem
                                                        key={color.id}
                                                        value={color.id}
                                                    >
                                                        {color.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

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
                                        placeholder='Product description'
                                        disabled={
                                            isLoadingCreate || isLoadingUpdate
                                        }
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
