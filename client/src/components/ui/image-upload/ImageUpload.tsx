import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import { Button } from '../button';

import { MAX_IMAGES, useUpload } from './useUpload';

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
    const {
        handleButtonClick,
        handleFileChange,
        removeImage,
        isUploading,
        fileInputRef,
    } = useUpload(value, onChange);

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

                        <Button
                            type='button'
                            variant='secondary'
                            size='icon'
                            disabled={isDisabled}
                            onClick={() => removeImage(url)}
                            aria-label='Remove image'
                            className='absolute top-2 right-2 size-7'
                        >
                            <X className='size-4' />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                type='button'
                disabled={
                    isDisabled || isUploading || value.length >= MAX_IMAGES
                }
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
