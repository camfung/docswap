'use client';

import { Form } from '@/components/ui/form';
import SimpleBar from '@/components/ui/simplebar';
import Upload from '@/components/ui/upload';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import Select, { SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ActionIcon, Button, Text, Textarea, Title, Input } from 'rizzui';
import { darkModeStyles, lightModeStyles } from './document-upload-form-styles';
import { useModal } from './modal-views/use-modal';

import { useDocuments } from '@/contexts/DocumentContext';
import axios from 'axios';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import {
  PiArrowLineDownBold,
  PiFile,
  PiFileCsv,
  PiFileDoc,
  PiFilePdf,
  PiFileXls,
  PiFileZip,
  PiTrashBold,
} from 'react-icons/pi';
import { Category, Tag, fetchParentCategories, fetchTags, mapToFormData } from './document-upload-form-utils';
import { useUser } from '@/contexts/UserContext';

export type ReviewFormValues = {
  address: any;
  title: "",
  category: { value: string, label: string }
  subCategory: Category,
  description: "",
  tags: [Tag: {
    __isNew__: undefined; value: string, label: string
  }],
  role: "",
};


const fileType = {
  'text/csv': <PiFileCsv className="h-5 w-5" />,
  'text/plain': <PiFile className="h-5 w-5" />,
  'application/pdf': <PiFilePdf className="h-5 w-5" />,
  'application/xml': <PiFileXls className="h-5 w-5" />,
  'application/zip': <PiFileZip className="h-5 w-5" />,
  'application/gzip': <PiFileZip className="h-5 w-5" />,
  'application/msword': <PiFileDoc className="h-5 w-5" />,
} as { [key: string]: React.ReactElement };


export default function DocumentUploadForm() {
  const [files, setFiles] = useState<Array<File>>([]);
  const [subCategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [reset, setReset] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { closeModal } = useModal();
  const { theme, setTheme } = useTheme();

  const { user, fetchUser } = useUser();
  const imageRef = useRef<HTMLInputElement>(null);
  const { fetchCurrentUserDocuments } = useDocuments();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const handleCategoryChange = (selectedCategory: SingleValue<{ value: string; label: string; }>, onChange: CallableFunction) => {
    getSubcategories(selectedCategory!.value);
    onChange(selectedCategory);
  };

  function handleFileDrop(event: React.ChangeEvent<HTMLInputElement>) {

    const uploadedFiles = (event.target as HTMLInputElement).files;
    const newFiles = Object.entries(uploadedFiles as object)
      .map((file) => {
        if (file[1]) return file[1];
      })
      .filter((file) => file !== undefined);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }

  const onSubmit: SubmitHandler<ReviewFormValues> = async (data) => {
    // create the new Tags
    const formData = mapToFormData(data);
    let tagResponse;
    let tagIds;
    let newTagIds;
    if (data.tags) {
      const newTags = data.tags.filter((tag) => tag.__isNew__);
      const tagObjs = newTags.map((tag) => ({ Name: tag.value }));

      tagResponse = await axios.post(`${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/tag/bulk/userTag`, tagObjs);

      console.log("🚀 ~ constonSubmit:SubmitHandler<ReviewFormValues>= ~ tagResponse:", tagResponse)

      if (tagResponse.data) {
        tagIds = tagResponse.data.map((tag: Tag) => tag.ID);
        newTagIds = tagResponse.data.map((tag: Tag) => tag.ID);
      }


      const existingTagIds = data.tags.filter((tag) => !tag.__isNew__).map((tag) => tag.value);
      if (newTagIds) {
        tagIds = [...newTagIds, ...existingTagIds];
      }
      else {
        tagIds = existingTagIds;
      }

      formData.append("tagIds", tagIds.join(','));
    }

    if (data.address) {
      formData.append('address', data.address);
    }

    // Close the modal and show a loading toast
    closeModal();
    toast.loading(<Text as="b">Uploading {files.length} file{
      files.length > 1 ? 's' : ''
    }...</Text>);

    formData.append('file', files[0]);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/document/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    setReset({
      category: "",
      subCategory: "",
      description: "",
      tags: "",
    });

    // Refetch the documents
    await fetchCurrentUserDocuments(false, true);

    // Dismiss the loading toast and show a success toast
    toast.dismiss();
    toast.success(<Text as="b">File{
      files.length > 1 ? 's' : ''
    } successfully uploaded</Text>);

    return data;
  };

  function handleImageDelete(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    (imageRef.current as HTMLInputElement).value = '';
  }

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/category/search`;
      const response = await axios.post(url, {
        Params: [
          {
            Field: "parent_id",
            Operator: "=",
            value: `${categoryId}`
          }
        ]
      }, {
        params: {
          full: "false"
        }
      });


      if (response.status !== 200) {
        throw new Error('Failed to fetch categories');
      }
      const subCategories = response.data.map((subCategory: Category, index: number) => ({
        value: subCategory.ID,
        label: subCategory.Name,
      }));

      setSubcategories(subCategories);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategories = (categoryValue: string) => {
    fetchSubCategories(categoryValue)
  };


  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      const tags = await fetchTags(user!, setError, setLoading);
      console.log("🚀 ~ fetchTagsAndCategories ~ tags:", tags)
      setTags(tags);
      const parentCategories = await fetchParentCategories(setError);
      setCategories(parentCategories);
    };

    fetchTagsAndCategories();
  }, [setTags, setCategories]);

  const test = useCallback(() => {
    console.log(categories);
  }, [files, categories, subCategories, tags]);
  return (
    <Form<ReviewFormValues>
      resetValues={reset}
      onSubmit={onSubmit}
    >
      {({ register, control, formState: { errors } }) => (
        <div className='flex justify-around '>
          <div className="space-y-6 p-6">
            <Title as="h3" className="text-lg">
              {"Upload a File"}
            </Title>
            <Upload
              ref={imageRef}
              accept={"img"}
              onChange={(event) => handleFileDrop(event)}
              className="mb-6 min-h-[280px] justify-center border-dashed bg-gray-50 dark:bg-transparent"
            />

            {files.length > 0 && (
              <SimpleBar className="max-h-[280px]">
                <div className="grid grid-cols-1 gap-4">
                  {files?.map((file: File, index: number) => (
                    <div
                      className="flex min-h-[58px] w-full items-center rounded-xl border border-muted px-3 dark:border-gray-300"
                      key={file.name}
                    >
                      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted bg-gray-50 object-cover px-2 py-1.5 dark:bg-transparent">
                        {file.type.includes('image') ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            fill
                            className=" object-contain"
                            priority
                            alt={file.name}
                            sizes="(max-width: 768px) 100vw"
                          />
                        ) : (
                          <>{fileType[file.type]}</>
                        )}
                      </div>
                      <div className="truncate px-2.5">{file.name}</div>
                      <ActionIcon
                        onClick={() => handleImageDelete(index)}
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="ms-auto flex-shrink-0 p-0 dark:bg-red-dark/20"
                      >
                        <PiTrashBold className="w-6" />
                      </ActionIcon>
                    </div>
                  ))}
                </div>
              </SimpleBar>
            )}

            <Title as="h6">Address</Title>
            <Input
              {...register('address')}
              placeholder='Enter the address'
            />

            <Title as="h6">Category</Title>
            <Controller
              {...register('category', { required: true })}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onChange={(selectedOption: SingleValue<{ value: string; label: string; }>) => handleCategoryChange(selectedOption, field.onChange)}
                  styles={theme === "dark" ? darkModeStyles : lightModeStyles}
                  options={categories}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#444',
                      primary: '#555',
                    },
                  })}
                />
              )}
            />
            {subCategories.length != 0 &&
              (
                <>
                  <Title as="h6">Sub Category</Title>
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={theme === "dark" ? darkModeStyles : lightModeStyles}
                        options={subCategories}
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 0,
                          colors: {
                            ...theme.colors,
                            primary25: '#444',
                            primary: '#555',
                          },
                        })}
                      />
                    )}
                  />
                </>
              )}


            <Title as="h6">Tags</Title>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  isMulti
                  styles={theme == "dark" ? darkModeStyles : lightModeStyles}
                  options={tags}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                      ...theme.colors,
                      primary25: '#444',
                      primary: '#555',
                    },
                  })}
                />
              )}
            />
            <Textarea
              placeholder="Description"
              textareaClassName="h-24"
              className="col-span-2"
              {...register('description')}
            />
            <Button className="w-full" type="submit">
              <PiArrowLineDownBold className="me-1.5 h-[17px] w-[17px]" />
              {"Upload File"}
            </Button>
          </div>
        </div>
      )}
    </Form >

  );
}
