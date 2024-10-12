import axios from 'axios';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from 'rizzui';

interface FormValues {
    title: string;
    description: string;
}

interface CustomModalProps {
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    onCancel: () => void;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
}

const CreateTagForm: React.FC<CustomModalProps> = ({
    submitButtonLabel = 'Okay',
    cancelButtonLabel = 'Cancel',
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/tag/`, {
            Name: data.title,
            Description: data.description,
        })
        console.log(response)
    }

    const onCancel = () => {
    }


    const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
        onSubmit(data);
    };

    return (
        <div className="p-6 z-100">
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        {...register('title', { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.title && <span className="text-red-600 text-sm">This field is required</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        {...register('description', { required: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.description && <span className="text-red-600 text-sm">This field is required</span>}
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={onCancel}

                    >
                        {cancelButtonLabel}
                    </Button>
                    <Button
                        onClick={handleSubmit(handleFormSubmit)}

                    >
                        {submitButtonLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTagForm;
