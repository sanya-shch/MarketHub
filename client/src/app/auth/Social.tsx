'use client';

import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';

import { SERVER_URL } from '@/config/api.config';

export const Social = () => {
    const router = useRouter();

    return (
        <div className='space-y-3 w-full mt-5'>
            <Button
                className='w-full'
                variant='outline'
                onClick={() => router.push(`${SERVER_URL}/auth/google`)}
            >
                <FcGoogle className='size-5 mr-2' />
                Continue via Google
            </Button>
        </div>
    );
};
