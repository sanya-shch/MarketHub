import { ImagePlus } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Button } from '../button';

import { useUpload } from './useUpload';

interface ImageUploadProps {
    isDisabled: boolean;
    onChange: (value: string[]) => void;
    value: string[];
}

export const ImageUpload = ({
    isDisabled,
    onChange,
    value,
}: ImageUploadProps) => {
    const { handleButtonClick, handleFileChange, isUploading, fileInputRef } =
        useUpload(onChange);

    return (
        <div>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-5'>
                {value.map(url => (
                    <div
                        key={url}
                        className='relative rounded-md overflow-hidden w-[200px] h-[200px]'
                    >
                        <Image
                            src={url}
                            alt='Image'
                            fill
                            className='object-cover'
                        />
                    </div>
                ))}
            </div>

            <Button
                type='button'
                disabled={isDisabled || isUploading}
                variant='secondary'
                onClick={handleButtonClick}
                className={cn({
                    'mt-4': value.length,
                })}
            >
                <ImagePlus className='size-4 mr-2' />
                Upload images
            </Button>

            <input
                type='file'
                multiple
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isDisabled}
            />
        </div>
    );
};
