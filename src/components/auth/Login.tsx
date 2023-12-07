import Container from "../common/Container";
import GoogleLogo from "../../assets/GoogleLog.png";
import MicrosoftLogo from "../../assets/MicrosoftLog.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import TextBox from "../common/inputs/TextBox";
import { loginSchema, loginSchemaType } from "../../utils/schemas/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/user";

export const Login = () => {
  const backedUrl = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error") as string;
  const errors: { [key: string]: string } = {
    "invalid-email": "Invalid email domain. Login again using .edu email",
  };
  useEffect(() => {
    if (error) {
      toast.error(errors[error] || "Login failed", { duration: 4000 });
    }
  }, [error]);

  const { register, handleSubmit, reset } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({ mutationFn: login });

  const submit = async (data: loginSchemaType) => {
    try {
      await loginMutation.mutateAsync(data, {
        onError() {
          toast.error(`invalid credentials`);
          reset();
        },
        onSuccess(data: string) {
          const redirectUrl = `/auth/redirect?token=${data}`;
          window.location.href = redirectUrl;
        },
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Container>
      <div className='flex flex-col justify-center items-center h-full'>
        {error && (
          <>
            <div className='flex items-center justify-center w-full max-w-xs space-x-5 border rounded-md p-4 m-6'>
              <div className='bg-red-700 rounded-full flex items-center justify-center p-1'>
                <XMarkIcon className='text-white w-5 h-5' />
              </div>
              <div className='text-sm text-gray-400'>
                {errors[error] || "Login failed"}
              </div>
            </div>
          </>
        )}
        <div className='max-w-[578px] w-fit py-24 px-8 border sm:px-24 sm:py-10  flex-col sm:flex-row items-center space-y-3 sm:space-x-12 sm:space-y-0 justify-center  rounded-[10px] '>
          <div className='w-full'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl pb-6'>
              Sign in to your account
            </h1>
            <form className='space-y-2 md:space-y-2' onSubmit={handleSubmit(submit)}>
              <div className='w-full'>
                <TextBox label='Email' type='email' register={register("email")} />
              </div>
              <div className='w-full'>
                <TextBox
                  label='password'
                  type='password'
                  register={register("password")}
                />
              </div>
              <button
                type='submit'
                className=' w-full my-7 text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2   focus:outline-none'
              >
                Sign in
              </button>
            </form>
          </div>
          <Link to={`${backedUrl}/auth/signin/google`} className='w-full'>
            <div className=' border-gray-300 border-[1.5px] p-2 px-5 flex items-center gap-4 rounded-full w-full '>
              <img
                src={GoogleLogo}
                alt='logo'
                className='w-[30px] h-[30px] sm:w-[35px] sm:h-[35px]'
              />
              <p className='font-medium text-base text-gray-600'>
                Continue with Google
              </p>
            </div>
          </Link>

          <Link to={`${backedUrl}/auth/signin/microsoft`} className='w-full'>
            <div className=' border-gray-300 border-[1.5px] p-2 px-5 flex items-center  gap-4 rounded-full w-full '>
              <img
                src={MicrosoftLogo}
                alt='logo'
                className='w-[28px] h-[28px] sm:w-[35px] sm:h-[35px]'
              />
              <p className='font-medium text-base text-gray-600'>
                Continue with Microsoft
              </p>
            </div>
          </Link>
          <p className='text-sm font-light text-gray-500 pt-6 flex'>
            Don’t have an account yet?
            <Link to={"/signup"}>
              <p className='px-2 font-[700] text-primary-600 hover:underline text-green-900 '>
                Sign up
              </p>
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login;
