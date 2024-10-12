'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@/components/ui/form';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';
import { loginSchema, LoginSchema } from '@/utils/validators/login.schema';

const initialValues: LoginSchema = {
  email: 'placeholder@email.com',
  password: 'password',
  rememberMe: true,
};

export default function SignInForm() {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const [isDisabled, setIsDisabled] = useState(true); // State to control disabled inputs

  const onSubmit: SubmitHandler<LoginSchema> = () => {
    toast.error(
      <Text>
        This is a placeholder, click on the{' '}
        <Text as="b" className="font-semibold text-gray-900">
          Sign in With Azure
        </Text>{' '}
        button to sign in or sign up.
      </Text>
    );
  };

  const handleSignUp = () => {
    signIn('azure-ad-b2c',{callbackUrl:"/"}, {prompt: 'login'});
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
              disabled={isDisabled} // Disable the input based on the state
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
              disabled={isDisabled} // Disable the input based on the state
            />
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                className="[&>label>span]:font-medium"
                disabled={isDisabled} // Disable the checkbox based on the state
              />
              {!isDisabled ? (
                  <Link
                    href={routes.auth.forgotPassword1}
                    className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
                  >
                    Forget Password?
                  </Link>
                ) : (
                  <span className="h-auto p-0 text-sm font-semibold text-gray-400 cursor-not-allowed">
                    Forget Password?
                  </span>
                )}
            </div>
            <Button className="w-full" type="submit" size="lg">
              <span>Sign in</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <a
          href="#"
          onClick={handleSignUp}
          className="font-semibold text-gray-700 transition-colors hover:text-blue cursor-pointer"
        >
          Sign Up
        </a>
      </Text>
    </>
  );
}
