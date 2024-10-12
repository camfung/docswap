'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiEnvelopeSimple } from 'react-icons/pi';
import { Form } from '@/components/ui/form';
import { Loader, Text, Input } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@/components/form-footer';
import {
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/utils/validators/personal-info.schema';
import AvatarUpload from '@/components/ui/file-upload/avatar-upload';

import { useUser } from '@/contexts/UserContext';

const Select = dynamic(() => import('rizzui').then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
  ssr: false,
});

export default function PersonalInfoView() {
  const { user, fetchUser, updateUserData } = useUser();
  const { register, control, setValue, getValues, formState: { errors } } = useForm<PersonalInfoFormTypes>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      bio: '',
    },
    resolver: zodResolver(personalInfoFormSchema),
  });

  const [isLoading, setIsLoading] = useState(true);

  // State variables for the form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await fetchUser();
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser, user]);


  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setBio(user.biography);
      setValue('first_name', user.firstName);
      setValue('last_name', user.lastName);
      setValue('email', user.email);
      setValue('bio', user.biography);
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = async (data) => {
    try {
      const updatedUser = await updateUserData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: user?.email || '',
        biography: data.bio || '',
      });
      console.log('User updated successfully:', updatedUser);
      toast.success(<Text as="b">Profile updated successfully!</Text>);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader variant="spinner" />
      </div>
    );
  }

  return (
    <Form<PersonalInfoFormTypes>
      onSubmit={onSubmit}
      className="@container"
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => (
        <>
          <FormGroup
            title="Personal Info"
            description="Update your personal details here"
            className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11 @4xl:col-span-1"
          />

          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            <FormGroup
              title="Profile Photo"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            >
              <div className="flex flex-col gap-1 @container @3xl:col-span-2">
                <AvatarUpload
                  name="avatar"
                  setValue={setValue}
                  getValues={getValues}
                  error={errors?.avatar?.message as string}
                />
              </div>
            </FormGroup>

            <FormGroup
              title="Name"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            >
              <Input
                placeholder="First Name"
                {...register('first_name')}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setValue('first_name', e.target.value);
                }}
                error={errors.first_name?.message}
                className="flex-grow"
              />
              <Input
                placeholder="Last Name"
                {...register('last_name')}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setValue('last_name', e.target.value);
                }}
                error={errors.last_name?.message}
                className="flex-grow"
              />
            </FormGroup>

            <FormGroup
              title="Email Address"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            >
              <Input
                className="col-span-full"
                prefix={
                  <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                }
                type="email"
                placeholder="joe.smith@example.com"
                {...register('email')}
                value={email}
                error={errors.email?.message}
                disabled
              />
            </FormGroup>

            <FormGroup
              title="Bio"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            >
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, value } }) => (
                  <QuillEditor
                    value={bio}
                    onChange={(content) => {
                      onChange(content);
                      setBio(content);
                    }}
                    className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]"
                    labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                  />
                )}
              />
            </FormGroup>
          </div>

          <FormFooter
            // altBtnText="Cancel"
            submitBtnText="Save"
          />
        </>
      )}
    </Form>
  );
}
