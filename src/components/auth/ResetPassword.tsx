import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../apis/user";
import { SyncLoader } from "react-spinners";
import {
  resetPAsswordSchema,
  resetPAsswordSchemaType,
} from "../../utils/schemas/resetPassword.schema";
import Container from "../common/Container";
import TextBox from "../common/inputs/TextBox";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<resetPAsswordSchemaType>({
    resolver: zodResolver(resetPAsswordSchema),
  });

  const resetPasswordMutation = useMutation({ mutationFn: resetPassword });

  const submit = async (data: resetPAsswordSchemaType) => {
    try {
      await resetPasswordMutation.mutateAsync(
        { ...data, token: token! },
        {
          onSuccess() {
            toast.success(`Password Updated Successfully`);
            reset();
            navigate("/login");
          },
        },
      );
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
              Enter Your New Password
            </h1>
            <p className='pb-7 text-[15px]'>
              You will need to log in again with your new password
            </p>
            <form className='space-y-2 md:space-y-2' onSubmit={handleSubmit(submit)}>
              <div className='w-full'>
                <TextBox
                  label='New Password'
                  type='password'
                  error={errors.password?.message}
                  register={register("password")}
                />
              </div>
              <button
                type='submit'
                className=' w-full my-7 text-white bg-green-900 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-4 me-2 mb-2   focus:outline-none'
              >
                {resetPasswordMutation.isPending ? (
                  <SyncLoader size={8} color='#fff' />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;
