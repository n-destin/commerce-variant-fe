import React, {useState, useEffect} from 'react'
import { getDonateProductsNumber } from "../../apis/donation";

export const DonateProductsNumber: React.FC = () => {
  const [data, setData] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDonateProductsNumber();
      setData(result.number);
    };
    fetchData();
  }, []);

  if (data === null || data === 0) {
    return null;
  }

  const displayData = data > 10 ? "9+" : data;

  return (
    <div>
      <p className='inline-flex text-[10px] items-center rounded-full bg-action-color-500 px-1.5 py-[2px] font-medium text-white'>
        {displayData}
      </p>
    </div>
  );
};
