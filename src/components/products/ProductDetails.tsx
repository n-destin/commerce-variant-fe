import Container from "../common/Container";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../utils/queryKeys";
import { getProduct } from "../../apis/products";
import { useParams } from "react-router-dom";
import ProductsList from "./ProductsList";
import Button from "../common/Button";
import Modal from "../common/Modal";
import OrderForm from "../orders/OrderForm";
import { useState, useEffect, useContext } from "react";
import AuthGuard from "../../utils/AuthGuard";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/swiper-bundle.css";
import { Image } from "../../types";
import ProductDetailsSkeleton from "../skeletons/ProductDetailsSkeleton";
import ChatModel from "../chat/ChatModel";
import { ChatProvider } from "../../providers/ChatContextProvider";
import { AuthContext } from "../../context/Auth";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
SwiperCore.use([Navigation, Pagination]);

export const ProductDetails = () => {
  const [orderForm, setOrderForm] = useState(false);
  const [offerPage, setOfferPage] = useState(false);
  const [productImages, setProductImages] = useState<Image[]>([]);
  const { id } = useParams();

  const { isLoading, data: product } = useQuery({
    queryKey: [queryKeys.singleProduct, id],
    queryFn: () => getProduct(id || ""),
  });

  const user = useContext(AuthContext)?.user;
  const isDonation = product?.purpose?.slug.includes("DONAT");
  const isRent = product?.purpose?.slug.includes("RENT");

  useEffect(() => {
    if (productImages.length == 0 && product) {
      setProductImages([{ url: product.thumbnail }, ...product.gallery]);
    }
  }, [productImages, setProductImages, product]);

  return (
    <div>
      {isLoading && <ProductDetailsSkeleton />}
      {product && (
        <>
          <div className='flex py-12 justify-center bg-gray-100'>
            <Container>
              <div className='flex justify-center flex-col sm:flex-row  w-full gap-9'>
                <div className='product-slide w-full sm:w-1/3'>
                  <Swiper navigation spaceBetween={0} slidesPerView={1} loop={true}>
                    {productImages.map((image, index) => (
                      <SwiperSlide key={index} className=''>
                        <img
                          src={image.url}
                          alt={`Product Image ${index + 1}`}
                          className='h-full w-full rounded-xl'
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className='md:max-w-[500px]'>
                  <div className=' space-y-2'>
                    <div className='font-medium text-sm text-gray-500 uppercase flex items-center space-x-2'>
                      {product.category.name}{" "}
                      {product?.purpose && (
                        <>
                          <ChevronRightIcon className='w-3 h-3 mx-3' />
                          {product.purpose.name}
                        </>
                      )}
                    </div>
                    <div className='font-bold text-2xl capitalize'>
                      {product.name}
                    </div>
                    <p className='text-gray-500 text-sm py-6'>
                      {product.description}
                    </p>
                    <div className=' text-2xl font-bold '>
                      ${isDonation ? 0 : product.price}
                    </div>
                  </div>

                  <div className='flex w-full  py-3 gap-7'>
                    <div>
                      <div className='text-md font-base text-gray-500'>
                        Condition
                      </div>
                      <div className='text-sm uppercase font-medium'>
                        {product.condition.name}
                      </div>
                    </div>
                    <div>
                      <div className='text-md font-base text-gray-500'>College</div>
                      <div className='text-sm uppercase font-medium'>
                        {product.college?.name}
                      </div>
                    </div>
                  </div>

                  <div className='sm:flex w-full items-center gap-6 py-3'>
                    <div className='flex flex-wrap sm:flex-col md:flex-row space-x-2 sm:space-x-0 sm:space-y-2 md:space-y-0 md:space-x-2'>
                      {!(user?._id === product.owner?._id) && (
                        <>
                          <Button
                            label={
                              isRent
                                ? "Rent now"
                                : isDonation
                                ? "Claim now"
                                : "Order now"
                            }
                            onClick={() => setOrderForm(true)}
                          />

                          <Button
                            label={
                              isRent
                                ? "Ask info"
                                : isDonation
                                ? "Ask info"
                                : "Make an offer"
                            }
                            outline={true}
                            onClick={() => setOfferPage(true)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <Container>
            <ProductsList
              title='Similar products'
              products={product.similar}
              isLoading={isLoading}
            />
          </Container>

          {orderForm && !product.isOrdered && (
            <AuthGuard>
              <Modal
                centered
                title='Order details'
                onClose={() => setOrderForm(false)}
                isOpen={true}
                modalType={"orderDetail"}
              >
                <OrderForm setIsOpen={setOrderForm} product={product} />
              </Modal>
            </AuthGuard>
          )}

          {offerPage && (
            <AuthGuard>
              <ChatProvider>
                <Modal
                  centered
                  title={product.isOrdered ? "Chat with owner" : "Make an offer"}
                  onClose={() => setOfferPage(false)}
                  isOpen={true}
                  modalType='chat'
                >
                  <ChatModel product={product} />
                </Modal>
              </ChatProvider>
            </AuthGuard>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetails;
