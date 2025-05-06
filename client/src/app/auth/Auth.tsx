'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import { AuthFields } from './AuthFields';
import { Social } from './Social';
import { useAuthForm } from './useAuthForm';

export function Auth() {
    const [isReg, setIsReg] = useState(false);
    const { onSubmit, isPending, form } = useAuthForm(isReg);

    return (
        <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
            <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
                <Image
                    src='/images/auth.png'
                    alt='ReactShop'
                    width={100}
                    height={100}
                />
            </div>
            <div className='h-full flex flex-col items-center justify-center'>
                <Card className='border-none p-6 flex flex-col items-center justify-center w-[380px]'>
                    <CardHeader className='text-center pb-5 w-full'>
                        <CardTitle className='pb-1 text-3xl font-bold'>
                            {isReg ? 'Sign Up' : 'Login'}
                        </CardTitle>
                    </CardHeader>

                    <CardDescription>
                        Login or Create an account to make purchases
                    </CardDescription>

                    <CardContent className='p-0 w-full'>
                        <Form {...form}>
                            <form
                                className='space-y-5'
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <AuthFields
                                    form={form}
                                    isPending={isPending}
                                    isReg={isReg}
                                />

                                <Button className='w-full' disabled={isPending}>
                                    Continue
                                </Button>
                            </form>
                        </Form>

                        <Social />
                    </CardContent>

                    <CardFooter className='p-0 mt-4 text-sm text-muted-foreground'>
                        {isReg
                            ? 'Already have an account?'
                            : "Don't have an account?"}
                        <button
                            className='ml-1 text-sky-600'
                            onClick={() => setIsReg(!isReg)}
                        >
                            {isReg ? 'Login' : 'Sign Up'}
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
