import { UseFormReturn } from 'react-hook-form';

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { IAuthForm } from '@/shared/types/auth.interface';

interface AuthFieldsProps {
    form: UseFormReturn<IAuthForm>;
    isPending: boolean;
    isReg?: boolean;
}

export const AuthFields = ({
    form,
    isPending,
    isReg = false,
}: AuthFieldsProps) => {
    return (
        <>
            {isReg && (
                <FormField
                    control={form.control}
                    name='name'
                    rules={{
                        required: 'Name required',
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder='Name'
                                    disabled={isPending}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField
                control={form.control}
                name='email'
                rules={{
                    required: 'Email is required',
                    pattern: {
                        value: /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/,
                        message: 'Please enter a valid email',
                    },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                placeholder='Email'
                                type='email'
                                disabled={isPending}
                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name='password'
                rules={{
                    required: 'Password is required',
                    minLength: {
                        value: 6,
                        message: 'Password should be minimum 6 characters long',
                    },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                placeholder='Password'
                                type='password'
                                disabled={isPending}
                                {...field}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    );
};
