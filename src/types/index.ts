import { ComponentType, ReactNode } from "react";

export interface IRoute {
  path: string;
  element: ComponentType<unknown>;
  isProtected?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
}

export interface ICategoryRequest {
  id?: string;
  name: string;
}

export interface ICondition {
  _id: string;
  name: string;
}

export interface IConditionRequest {
  _id?: string;
  name: string;
}

export interface IPurpose {
  _id: string;
  name: string;
  slug: string;
}

export interface IPurposeRequest {
  id?: string;
  name: string;
  slug: string;
}
export interface Image {
  url: string;
}

export interface IProduct {
  _id: string;
  name: string;
  thumbnail: string;
  gallery: Array<Image>;
  price?: number;
  condition: ICondition;
  category: ICategory;
  college?: ICollege;
  description: string;
  owner: IUser;
  isAvailable?: boolean;
  purpose?: IPurpose;
  rent_days?: number;
}

export interface INotice {
  _id?: string;
  name: string;
  photo: string;
  description: string;
}

export interface IUser {
  _id: string;
  id: string;
  provider: string;
  displayName: string;
  isAdmin?: boolean;
  bankName: string;
  bankAccount: string;
  phoneNumber: string;
  name?: {
    familyName: string;
    givenName: string;
    middleName?: string;
  };
  email: string;
  emails?: Array<string>;
  photos?: Array<IUserPhotos>;
  college?: ICollege;
}


export interface IUserPhotos {
  value: string;
}


export interface ISlider {
  _id?: string;
  title?: string;
  photo?: string;
  description?: string;
  type?: string;
  sliderStatus?: string;
}

export interface ISliders {
  title: string;
  photo: string;
  description: string;
  category: string;
}

export interface IProductRequest {
  id?: string;
  name: string;
  thumbnail?: string[];
  gallery?: string[];
  price?: number;
  condition: string;
  category: string;
  description: string;
}

export interface ISingleProduct extends IProduct {
  similar: IProduct[];
  isOrdered?: boolean;
}

export interface INoticeRequest {
  id?: string;
  name: string;
  photo?: string;
  description: string;
}

export interface IUserRequest {
  id?: string;
  bankName?: string;
  bankAccount?: string;
  phone?: string;
}

export interface INewUserRequest {
  id?: string;
  name: {
    familyName?: string,
    givenName?: string,
    middleName?: string,
  },
  email?: string;
  password?: string;
  message?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISliderRequest {
  id?: string;
  title?: string;
  photo?: string;
  description?: string;
  type?: string;
  sliderStatus?: string;
}

export interface ProductListProps {
  filtersComponent?: ReactNode;
  title?: string;
  isLoading: boolean;
  products: IProduct[] | undefined;
  orders?: IOrderedProduct[];
}

export interface FiltersComponentProps {
  label: string;
}

export interface IUser {
  _id: string;
  id: string;
  provider: string;
  displayName: string;
  isAdmin?: boolean;
  name?: {
    familyName: string;
    givenName: string;
    middleName?: string;
  };
  email: string;
  emails?: Array<string>;
  phone?: string;
  photos?: Array<IUserPhotos>;
  college?: {
    _id: string;
    name: string;
  };
  isBanned?: boolean;
}
export interface ICollege {
  _id: string;
  name: string;
}

export interface IOrder {
  _id: string;
  product: IProduct;
  orderer: IUser;
  phone?: string;
  days?: number;
  total: number;
  deliveryStatus?: string;
  paymentStatus?: string;
  returnedDate?: Date;
  expectedReturnDate: string | Date;
  createdAt: string | Date;
}

export interface IOrderRequest {
  id?: string;
  product?: string;
  days?: number;
}

export interface IProductFilter {
  categories?: string[];
  colleges?: string[];
}

export interface IChat {
  _id: string;
  buyer: string;
  owner: string;
  product: string;
  acceptedPrice: number;
}

export interface IAcceptPrice {
  _id?: string;
  price: number;
}

export interface IChatDTO {
  _id: string;
  buyer: IUser;
  product: IProduct;
  acceptedPrice?: number;
  owner: IUser;
  messages?: IMessage[];
}

export interface IMessage {
  _id: string;
  chat: IChat;
  sender: IUser | string;
  text: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IMessageRequest {
  chat: string;
  text: string;
}
export interface IOrderedProduct extends IOrder {
  paymentStatus: string;
  deliveryStatus: string;
}

export interface IRentProductNumber {
  message: string;
  number: number;
}
export interface IDonateProductNumber {
  message: string;
  number: number;
}

export interface IOrderConfirm {
  orderId: string;
  code: string;
}

export interface IProductReturn {
  orderId: string;
}

export interface IProductLog {
  _id: string;
  text: string;
  user?: IUser;
  createdAt: string;
}

export interface IStatisticOverview {
  slug: string;
  number: number;
  link?: string;
}

export interface IStatistic {
  overview: IStatisticOverview[];
  transactions: IOrder[];
}

export interface IHomepageProducts {
  sale: IProduct[];
  other: IProduct[];
}
