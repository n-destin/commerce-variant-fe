import { FC, Fragment, useContext, useEffect, useState } from "react";
import { IOrderedProduct, IProduct } from "../../types";
import { Link } from "react-router-dom";
import {
  ChatBubbleLeftIcon,
  TruckIcon,
  ArchiveBoxArrowDownIcon,
  ArrowUturnRightIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../context/Auth";
import Modal from "../common/Modal";
import {
  confirmOrderDelivery,
  getOrderCode,
  setProductReturned,
} from "../../apis/orders";
import { BeatLoader } from "react-spinners";
import { ChatProvider } from "../../providers/ChatContextProvider";
import ChatModel from "../chat/ChatModel";
import Button from "../common/Button";
import TextField from "../common/inputs/TextBox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import OrderDetail from "../orders/OrderDetail";
import { queryKeys } from "../../utils/queryKeys";

interface Props {
  product: IProduct;
  order?: IOrderedProduct;
}
const Productcard: FC<Props> = ({
  product: { thumbnail, name, price, _id, purpose, condition },
  order,
}) => {
  const queryClient = useQueryClient();
  const [chatModal, setChatModal] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);

  const [orderCode, setOrderCode] = useState<string>();
  const [orderDeliveryModalOpen, setOrderDeliveryModalOpen] = useState(false);
  const [orderReturnModalOpen, setOrderReturnModalOpen] = useState(false);
  const [orderConfirmationCode, setOrderConfirmationCode] = useState("");
  const orderMutation = useMutation({ mutationFn: confirmOrderDelivery });
  const returnMutation = useMutation({ mutationFn: setProductReturned });

  const context = useContext(AuthContext);
  const resizeImage = (imageUrl: string) => {
    const keyword = "upload";
    const keywordIndex = imageUrl.indexOf(keyword);
    const beforeKeyword = imageUrl.slice(0, keywordIndex + keyword.length);
    const afterKeyword = imageUrl.slice(keywordIndex + keyword.length);
    return beforeKeyword + "/h_211,w_211/" + afterKeyword;
  };

  useEffect(() => {
    if (order && context?.user?._id == (order?.orderer?._id ?? order?.orderer)) {
      getOrderCode(order?._id).then((response) => {
        setOrderCode(response);
      });
    }
  }, [context, order]);
  const confirmOrderDeliveryFunc = () => {
    if (order) {
      orderMutation.mutate(
        { orderId: order._id, code: orderConfirmationCode },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.sellerOrders,
            });
            toast.success("Order status changed");
            setOrderDeliveryModalOpen(false);
          },
          onError: () => {
            toast.error("Failed to update");
          },
        },
      );
    }
  };

  const setReturned = () => {
    if (order) {
      returnMutation.mutate(
        { orderId: order._id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.sellerOrders,
            });
            toast.success("Order marked as returned");
            setOrderReturnModalOpen(false);
          },
          onError: () => {
            toast.error("Failed to update");
          },
        },
      );
    }
  };
  return (
    <Fragment>
      {/* Order delivery modal */}
      <Modal
        centered
        isOpen={orderDeliveryModalOpen}
        onClose={() => setOrderDeliveryModalOpen(false)}
        title={"Order derivery code"}
      >
        <div className='  bg-gray-100 p-4'>
          {(order?.orderer._id || order?.orderer) == context?.user?._id && (
            <p className=' font-medium text-action-color-500'>
              <p className='text-red-500 text-sm'>
                Share the code below if only you've received the product
              </p>
              {orderCode ?? <BeatLoader color='rgba(0,77,77,0.58)' />}
            </p>
          )}

          {(order?.orderer._id || order?.orderer) !== context?.user?._id && (
            <p className=' font-medium text-action-color-500'>
              <p className='text-red-500 text-sm'>
                Enter derivery code to confirm that the product has already delivered
                to the client
              </p>
              <div className=' space-y-2 mt-3'>
                <TextField type='text' onChange={setOrderConfirmationCode} />
                <Button
                  label='Confirm'
                  type='button'
                  isLoading={orderMutation.isPending}
                  onClick={confirmOrderDeliveryFunc}
                />
              </div>
            </p>
          )}
        </div>
      </Modal>
      {/* End of order delivery modal */}

      {/* Order return modal */}
      <Modal
        centered
        isOpen={orderReturnModalOpen}
        onClose={() => setOrderReturnModalOpen(false)}
        title={"Comfirm Product Returned"}
      >
        <div className=''>
          <div className=' font-medium text-action-color-500'>
            <p className='text-gray-500 text-sm'>
              This will mark the product as returned and make the product available
              again.
            </p>
            <div className=' space-y-2 mt-5'>
              <Button
                label='Confirm'
                type='button'
                isLoading={returnMutation.isPending}
                onClick={setReturned}
              />
            </div>
          </div>
        </div>
      </Modal>
      {/* End of order return modal */}

      <Link to={order ? "#" : `/product/${_id}`}> 
        <div className='bg-white overflow-auto shadow-md rounded-md relative'>
          <img className='w-full' src={resizeImage(thumbnail)} alt='' />
          <div className='p-4 space-y-3'>
            <div>
              <p className=' font-bold text-md line-clamp-1'>{name}</p>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='text-xs'>
                    <span className='font-light mr-2'>Condition:</span>
                    <span className='font-semibold'>{condition.name}</span>
                  </div>
                  <div className='text-xs'>
                    <span className='font-light mr-2'>Purpose:</span>
                    <span className='font-semibold'>{purpose?.name || "Sales"}</span>
                  </div>
                </div>
                <div className='text-xl text-teal-600 font-bold'>
                  ${order ? order.total : price || 0}
                </div>
              </div>
            </div>
            <div className='text-sm'>
              {order && (
                <div className='flex gap-3'>
                  <InformationCircleIcon
                    className='w-5 text-blue-500'
                    onClick={() => setOrderDetailsModal(true)}
                  />
                  {orderDetailsModal && (
                    <Modal
                      centered
                      title='Order details'
                      onClose={() => setOrderDetailsModal(false)}
                      isOpen={true}
                      modalType='orderDetail'
                    >
                      <OrderDetail id={order._id} />
                    </Modal>
                  )}
                  {(order.orderer._id || order.orderer) == context?.user?._id && (
                    <ChatBubbleLeftIcon
                      className='w-5 text-action-color-500'
                      onClick={() => setChatModal(true)}
                    />
                  )}
                  {purpose?.slug?.includes("RENT") &&
                    order.deliveryStatus == "DELIVERED" &&
                    (order.orderer._id || order.orderer) != context?.user?._id &&
                    order.returnedDate == undefined && (
                      <ArrowUturnRightIcon
                        className='w-5 text-gray-500'
                        onClick={() => setOrderReturnModalOpen(true)}
                      />
                    )}
                  {chatModal && (
                    <ChatProvider>
                      <Modal
                        centered
                        title='Chat with owner'
                        onClose={() => setChatModal(false)}
                        isOpen={true}
                        modalType='chat'
                      >
                        <ChatModel product={order.product} />
                      </Modal>
                    </ChatProvider>
                  )}

                  <div
                    className=' cursor-pointer'
                    onClick={() => setOrderDeliveryModalOpen(true)}
                  >
                    {order.deliveryStatus == "NOT_YET_DELIVERED" && (
                      <>
                        {(order.orderer._id || order.orderer) ==
                        context?.user?._id ? (
                          <ArchiveBoxArrowDownIcon className='w-5 text-green-700' />
                        ) : (
                          <TruckIcon className='w-5 text-green-700' />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Fragment>
  );
};

export default Productcard;
