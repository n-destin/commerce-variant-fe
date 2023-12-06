import { Link } from "react-router-dom";
import TextBox from "../common/inputs/TextBox";
import { useMutation } from "@tanstack/react-query";
import {
  createNewUserSchema,
  createNewUserSchemaType,
} from "../../utils/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createNewUser } from "../../apis/user";
import toast from "react-hot-toast";

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createNewUserSchemaType>({
    resolver: zodResolver(createNewUserSchema),
  });
  const newUserMutation = useMutation({ mutationFn: createNewUser });

  const submit = async (data: createNewUserSchemaType) => {
    try {
      await newUserMutation.mutateAsync(
        {
          ...data,
          name: {
            familyName: data.firstName,
            givenName: data.lastName,
          },
        },
        {
          onSuccess() {
            toast.success(
              `account created successful continue to email to verify for account`,
            );
            reset();
          },
        },
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <section className='bg-gray-50'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 '>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
              Create an account
            </h1>
            <form className='space-y-2 md:space-y-2' onSubmit={handleSubmit(submit)}>
              <div className='flex gap-6 w-full'>
                <TextBox
                  label='First name'
                  type='text'
                  error={errors.firstName?.message}
                  register={register("firstName")}
                />
                <TextBox
                  label='last name'
                  type='text'
                  error={errors.lastName?.message}
                  register={register("lastName")}
                />
              </div>
              <div>
                <TextBox
                  label='Your email'
                  type='email'
                  error={errors.email?.message}
                  register={register("email")}
                />
              </div>
              <div>
                <TextBox
                  label='Password'
                  placeholder='••••••••'
                  type='password'
                  error={errors.password?.message}
                  register={register("password")}
                />
              </div>
              <div className='py-3'>
                <button
                  type='submit'
                  className='w-full text-white bg-green-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Create an account
                </button>
              </div>
              <p className='text-sm font-light text-gray-500 flex'>
                Already have an account?{" "}
                <Link to={"/login"}>
                  <p className='font-medium text-primary-600 hover:underline px-2'>
                    Login here
                  </p>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
