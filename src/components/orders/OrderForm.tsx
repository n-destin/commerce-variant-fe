import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, orderSchemaType } from "../../utils/schemas/order.schema";
import Button from "../common/Button";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { queryKeys } from "../../utils/queryKeys";
import { createOrder } from "../../apis/orders";
import { IProduct } from "../../types";
import TextArea from "../common/inputs/TextArea";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface IOrderForm {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: IProduct;
}

interface DaysProps {
  days: number;
  onAdd: () => void;
  onMinus: () => void;
}

const DaysSelector: FC<DaysProps> = ({ days, onAdd, onMinus }) => {
  return (
    <div className='days-selector flex space-x-6 items-center'>
      <MinusCircleIcon onClick={onMinus} className='w-5 w-5' />
      <span className='font-bold text-2xl'>{days}</span>
      <PlusCircleIcon onClick={onAdd} className='w-5 w-5' />
    </div>
  );
};

const OrderForm: FC<IOrderForm> = ({ setIsOpen, product }) => {
  const isDonation = product.purpose?.slug.includes("DONAT");
  console.log(product.purpose?.name);
  const [total, setTotal] = useState(product.price);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<orderSchemaType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      days: 1,
    },
  });

  const orderMutation = useMutation({ mutationFn: createOrder });

  const submit = (data: orderSchemaType) => {
    const formData = {
      ...data,
    };
    orderMutation.mutate(formData, {
      onSuccess(paymentUrl: string) {
        if (paymentUrl != "created") {
          window.location.href = paymentUrl;
          queryClient.invalidateQueries({
            queryKey: queryKeys.orders,
          });
        } else {
          queryClient.invalidateQueries({
            queryKey: queryKeys.singleProduct,
          });
          window.location.href = "/dashboard/orders";
        }
        setIsOpen(false);
        reset();
      },
    });
  };
  const handleTotalCalculation = (days: number) => {
    if (days > 0) {
      setValue("days", days);
      setTotal(days * (product.price || 0));
    } else {
      setValue("days", 1);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      id='OrderForm'
      className='w-full space-y-3'
      encType='multipart/form,-data'
    >
      <div className='flex space-x-6'>
        <div>
          <img
            src={product.thumbnail}
            className='w-32 h-32 rounded-md'
            alt={product.name}
          />
        </div>
        <div>
          <div className='font-bold text-gray-800'>{product.name}</div>
          <div className='font-semibold uppercase text-gray-500 mb-4'>
            {product.category.name}
          </div>
          {!isDonation && (
            <>
              <div className='font-semibold text-gray-500'>
                Unit Price:
                <span className='font-bold text-gray-700'>${product.price}</span>
              </div>
              <div className='font-semibold text-gray-500'>
                Total Price:{" "}
                <span className='font-bold text-gray-700'>${total}</span>
              </div>
            </>
          )}
          {isDonation && (
            <>
              <div className='text-lg font-bold text-gray-800'>Donation</div>
              <div className='font-semibold text-gray-500'>
                Unit Price:
                <span className='font-bold text-gray-700'>${0}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className='hidden'>
        <TextArea
          label='product'
          value={product._id}
          error={errors.product?.message}
          register={register("product")}
        />
      </div>

      {product.purpose?.slug.includes("RENT") && (
        <div className='flex'>
          <label className='w-36'>Days</label>
          <DaysSelector
            days={getValues("days") || 1} // Assuming "days" is the field name
            onAdd={() => {
              handleTotalCalculation((getValues("days") || 1) + 1);
            }}
            onMinus={() => {
              if ((getValues("days") || 1) > 1) {
                handleTotalCalculation((getValues("days") || 1) - 1);
              }
            }}
          />
          {errors.days && <span>{errors.days.message}</span>}
        </div>
      )}

      <Button
        label='Submit order'
        isLoading={orderMutation.isPending}
        type='submit'
        // include onClick
      />
    </form>
  );
};

export default OrderForm;
