import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { getCategories } from "../../apis/category";
import { queryKeys } from "../../utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../../types";

export const CategoriesList = () => {

  const {
    isLoading,
    isError,
    error,
    data: categories,
  } = useQuery({
    queryFn: getCategories,
    queryKey: queryKeys.categoriesInForm,
  });

  console.log(categories, "reached here");
  
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !categories) {
    return <div>Error: {error?.message || "An error occurred"}</div>;
  }

  return (
    <div>
      <ul
        role='list'
        className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'
      >
        {categories.map((category: ICategory) => (
          <li
            key={category.name}
            className='col-span-1 flex rounded-md shadow-sm border bg-gray-100'
          >
            <div className='flex-shrink-0 flex items-center bg-[#003D29] justify-center w-16 text-white text-sm font-medium rounded-l-md'>
              {category.name?category.name.charAt(0) : ""}
            </div>
            <div className='flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white'>
              <div className='flex-1 truncate px-4 py-2 text-sm'>
                <a
                  href='#'
                  className='font-medium text-gray-900 hover:text-gray-600'
                >
                  {category.name}
                </a>
              </div>
              <div className='flex-shrink-0 pr-2'>
                <button
                  type='button'
                  className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  <span className='sr-only'>Open options</span>
                  <EllipsisVerticalIcon className='h-5 w-5' aria-hidden='true' />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
