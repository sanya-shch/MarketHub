import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useRef } from 'react';
import toast from 'react-hot-toast';

import { fileService } from '@/services/file.service';

// same limit as ProductDto on the server
export const MAX_IMAGES = 10;

export const useUpload = (
    value: string[],
    onChange: (value: string[]) => void,
) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: uploadFiles, isPending: isUploading } = useMutation({
        mutationKey: ['upload files'],
        mutationFn: (formData: FormData) => fileService.upload(formData),
        onSuccess(data) {
            // new images are added to the existing ones, they do not replace them
            onChange([...value, ...data.map(file => file.url)]);
        },
        onError() {
            toast.error('Error loading files');
        },
    });

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);

        // the same file can be selected again later
        event.target.value = '';

        if (!selectedFiles.length) return;

        if (value.length + selectedFiles.length > MAX_IMAGES) {
            toast.error(`No more than ${MAX_IMAGES} images`);
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        uploadFiles(formData);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (url: string) => {
        onChange(value.filter(image => image !== url));
    };

    return {
        handleButtonClick,
        handleFileChange,
        removeImage,
        isUploading,
        fileInputRef,
    };
};
