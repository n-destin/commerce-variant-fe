import Container from "../common/Container";
import toast from "react-hot-toast";
import TextBox from "../common/inputs/TextBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../apis/user";
import { SyncLoader } from "react-spinners";
import {
  ForgotPasswordSchemaType,
  forgotPAsswordSchema,
} from "../../utils/schemas/forgotPassword";

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPAsswordSchema),
  });

  const forgotPasswordMutation = useMutation({ mutationFn: forgotPassword });

  const submit = async (data: ForgotPasswordSchemaType) => {
    try {
      await forgotPasswordMutation.mutateAsync(data, {
        onSuccess() {
          toast.success(
            `Please check your email for instruction to change your password`,
          );
          reset();
        },
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Container>
      <div className='flex flex-col justify-center items-center h-full'>
        <div className='max-w-[578px] w-fit py-24 px-8 border sm:px-24 sm:py-10  flex-col sm:flex-row items-center space-y-3 sm:space-x-12 sm:space-y-0 justify-center  rounded-[10px] '>
          <div className='w-full'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl pb-6'>
              Forgot Password
            </h1>
            <p className='pb-7 text-[15px]'>
              Enter the email associated with your account, and we'll send an email
              with instructions to reset your password
            </p>
            <form className='space-y-2 md:space-y-2' onSubmit={handleSubmit(submit)}>
              <div className='w-full'>
                <TextBox
                  label='Email'
                  type='email'
                  error={errors.email?.message}
                  register={register("email")}
                />
              </div>
              <button
                type='submit'
                className=' w-full my-7 text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2   focus:outline-none'
              >
                {forgotPasswordMutation.isPending ? (
                  <SyncLoader size={8} color='#fff' />
                ) : (
                  "Forgot password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
