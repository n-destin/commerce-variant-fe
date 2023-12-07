import LoginPage from "../pages/auth/Login";
import LandingPage from "../pages/public/LandingPage";
import NoticePage from "../pages/public/NoticePage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";
import RentProductsPage from "../pages/products/RentProductsPage";
import { IRoute } from "../types";
import DonatedProductsPage from "../pages/products/DonatedProductsPage";
import { SignupPage } from "../pages/auth/Signup";

const publicRoutes: IRoute[] = [
  {
    path: "",
    element: LandingPage,
  },
  {
    path: "login",
    element: LoginPage,
  },
  {
    path: "notice",
    element: NoticePage,
  },
  {
    path: "product/:id",
    element: ProductDetailsPage,
  },
  {
    path: "rent-products",
    element: RentProductsPage,
  },
  {
    path: "donations",
    element: DonatedProductsPage,
  },
  {
    path: "signup",
    element: SignupPage,
  },
];

export default publicRoutes;
