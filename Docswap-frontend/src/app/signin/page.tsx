import SignInForm from '@/app/signin/sign-in-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import Image from 'next/image';
import UnderlineShape from '@/components/shape/underline';
import { metaObject, siteConfig, MODE } from '@/config/site.config';
import signInImg from '@public/sign-in-image.png';
import signInImgInv from '@public/sign-in-img-inv.png';


export const metadata = {
  ...metaObject('Sign In'),
};

export default function SignIn() {
  return (
    <AuthWrapperOne
      title={
        <>
          Welcome back! Please{' '}
          <span className="relative inline-block">
            Sign in to
            <UnderlineShape className="absolute -bottom-2 start-0 h-2.5 w-24 text-blue md:w-28 xl:-bottom-1.5 xl:w-36" />
          </span>{' '}
          continue.
        </>
      }
      // description="By signing up, you will gain access to exclusive content, special
      // offers, and be the first to hear about exciting news and updates."
      bannerTitle="Where Real Estate Documents Find Their Match."
      bannerDescription="The hub for finding and trading real-estate documents."
      isSocialLoginActive={true}
      pageImage={
        <div className="relative mx-auto aspect-[4/3.37] w-[500px] xl:w-[620px] 2xl:w-[820px]">
                  <Image src={signInImg} alt="Docswap Light Mode" className="ps-2.5 dark:invert" />
        </div>
      }
    >
      {/* <SignInForm /> */}
    </AuthWrapperOne>
  );
}
