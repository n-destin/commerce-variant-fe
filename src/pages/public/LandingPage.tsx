import { useQuery } from "@tanstack/react-query";
import Container from "../../components/common/Container";
import Filters from "../../components/products/Filters";
import ProductsList from "../../components/products/ProductsList";
import Slider from "../../components/slider/Slider";
import { queryKeys } from "../../utils/queryKeys";
import { getHomepageProducts } from "../../apis/products";
import { IHomepageProducts, IProduct } from "../../types";
import { useEffect, useState } from "react";
// import AdsSlider from "../../components/slider/AdsSlider";

const LandingPage = () => {
  const [topProducts, setTopProducs] = useState<IProduct[] | undefined>();
  const [data, setData] = useState<IHomepageProducts | undefined>(undefined);
  const { data: queryData, isLoading } = useQuery({
    queryKey: queryKeys.homepageProducts,
    queryFn: getHomepageProducts,
  });

  useEffect(() => {
    if (queryData) {
      setTopProducs(queryData.sale);
      setData(queryData);
    }
  }, [queryData]);

  return (
    <>
      <Slider />
      {/* <Container>
        <ProductsList
          products={topProducts}
          isLoading={isLoading}
          title='Trending on sale'
          filtersComponent={
            <div className='flex gap-2 flex-wrap xs:flex-nowrap'>
              <Filters setData={setTopProducs} />
            </div>
          }
        />
      </Container> */}
      {/* <AdsSlider /> */}
      <Container>
        <ProductsList
          products={data?.other}
          isLoading={isLoading}
          title='Rent or Claim Now'
          filtersComponent = {
            <div className='flex gap-2 flex-wrap xs:flex-nowrap'>
              <Filters setData={setData} />
            </div>
          }
        />
      </Container>
    </>
  );
};

export default LandingPage;
