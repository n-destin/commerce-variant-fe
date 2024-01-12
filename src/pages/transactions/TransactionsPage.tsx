import DataTable from "react-data-table-component";
import { IOrder } from "../../types";
import { getTransactions } from "../../apis/orders";
import { queryKeys } from "../../utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

const columns = [
  {
    name: "Product",
    cell: (row: IOrder) => (
      <div>
        <img src={row.product.thumbnail} className='w-14 h-14 rounded-md' />
        <p className='text-center font-bold'>{row.product.name}</p>
      </div>
    ),
  },
  {
    name: "Buyer",
    cell: (row: IOrder) => <div>{row.orderer?.displayName}</div>,
  },
  {
    name: "Seller",
    cell: (row: IOrder) => <div>{row.product.owner?.displayName}</div>,
  },
  {
    name: "Amount",
    cell: (row: IOrder) => <div className='font-bold'>${row.total}</div>,
  },
  {
    name: "Purpose",
    cell: (row: IOrder) => <div>{row.product.purpose?.name}</div>,
  },
  {
    name: "Paid",
    cell: (row: IOrder) => (
      <div className=' font-semibold'>
        {row.paymentStatus == "PAID" ? (
          <div className='text-green-500'>
            <CheckCircleIcon className='text-green-500  w-5 stroke-2 ' />
          </div>
        ) : (
          <div className='text-red-600 p-1 rounded-full'>
            <ClockIcon className='text-red-500 w-5 stroke-2 ' />
          </div>
        )}
      </div>
    ),
  },
  {
    name: "Delivery",
    cell: (row: IOrder) => (
      <div className='font-semibold'>
        {row.deliveryStatus == "DELIVERED" ? (
          <div className='text-green-500'>
            <CheckCircleIcon className='text-green-500  w-5 stroke-2 ' />
          </div>
        ) : (
          <div className='text-red-600 p-1 rounded-full'>
            <ClockIcon className='text-red-500 w-5 stroke-2 ' />
          </div>
        )}
      </div>
    ),
  },
];

const TransactionsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.transactions,
    queryFn: getTransactions,
  });
  return (
    <div className='flex flex-col w-full'>
      <DataTable
        persistTableHead
        title='Transactions'
        pagination
        striped
        highlightOnHover
        columns={columns}
        data={data || []}
        progressPending={isLoading}
      />
    </div>
  );
};

export default TransactionsPage;
