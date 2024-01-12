import { getMyProducts } from "../../apis/products";
import { queryKeys } from "../../utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../types";
import TableActions from "./TableActions";

export const ProductsTable = () => {
  const { isLoading, data: products } = useQuery({
    queryFn: () => getMyProducts(),
    queryKey: queryKeys.productsInDashboard,
  });

  return (
    <>
      {isLoading && (
        <>
          <p className='p-12 text-center'>Loading...</p>
        </>
      )}
      {products && (
        <div className='overflow-auto lg:overflow-visible w-full text-base'>
          <table className='table text-gray-600 border-separate space-y-6 text-sm w-full border-spacing-y-4'>
            <thead className='bg-white text-gray-700'>
              <tr className='rounded-xl bg-white'>
                <th className='py-4 px-6 rounded-l-xl text-left uppercase font-md'>
                  PRODUCT
                </th>
                <th className='py-4 px-6 text-left uppercase font-md'>Category</th>
                <th className='py-4 px-6 text-left uppercase font-md'>Price</th>
                <th className='py-4 px-6 text-left uppercase font-md'>Gallery</th>
                <th className='py-4 px-6 text-left uppercase font-md'>Status</th>
                <th className='py-4 px-6 text-left rounded-r-xl uppercase font-md'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: IProduct) => (
                <tr
                  className='bg-white rounded-xl py-2 text-base font-md'
                  key={product._id}
                >
                  <td className='py-3 px-6 rounded-l-xl'>
                    <div className='flex align-items-center w-60 min-w-full'>
                      <img
                        className='rounded-md h-14 w-14  object-cover'
                        src={product.thumbnail}
                        alt={product.name}
                      />
                      <div className='ml-3 font-md'>
                        <div className='text-gray-700 font-bold text-lg capitalize'>
                          {product.name}
                        </div>
                        <div className='text-gray-500'>{product.condition.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className='py-3 px-6'>{product.category ? product.category.name : ""}</td>
                  <td className='py-3 px-6 font-bold'>{product.price}$</td>
                  <td className='border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4'>
                    <div className='flex w-32 min-w-full'>
                      {product.gallery.slice(0, 5).map((img, index) => (
                        <img
                          key={`${product._id}-${index}`} // Use a unique key based on the product ID and index
                          src={img.url}
                          alt={`${product.name} - Gallery ${index + 1}`}
                          className='w-14 h-14 rounded-md border-2 border-gray-200 shadow shadow-gray-300 shadow-xl -ml-4'
                        />
                      ))}
                    </div>
                  </td>
                  <td className='py-3 px-6'>
                    <span
                      className={`${
                        product.isAvailable ? "bg-green-400" : "bg-red-400"
                      } text-gray-50 rounded-md px-2 text-xs`}
                    >
                      {product.isAvailable ? "AV" : "N/AV"}
                    </span>
                  </td>
                  <td className='py-3 px-6 rounded-r-xl'>
                    <TableActions product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ProductsTable;
