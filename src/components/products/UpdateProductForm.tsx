import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import TextBox from "../common/inputs/TextBox";
import SelectOption from "../common/inputs/SelectOption";
import FileInput from "../common/inputs/FileInput";
import { getCategories } from "../../apis/category";
import { getConditions } from "../../apis/condition";
import { updateProduct } from "../../apis/products";
import { uploadFiles } from "../../apis/assets";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  createProductSchemaType,
} from "../../utils/schemas/product.schema";
import Button from "../common/Button";
import toast from "react-hot-toast";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { queryKeys } from "../../utils/queryKeys";
import { ICondition, IProduct, ICategory, IPurpose } from "../../types";
import TextArea from "../common/inputs/TextArea";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getPurposes } from "../../apis/purpose";

interface IPRoductForm {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: IProduct;
}

const UpdateProductForm: FC<IPRoductForm> = ({ setIsOpen, product }) => {
  const queryClient = useQueryClient();
  const [priceRequired, setPriceRequired] = useState<boolean | undefined>();
  const [galleryPreview, setGalleryPreview] = useState<
    { url: string; index: number; img: File }[]
  >([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    undefined,
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<createProductSchemaType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      category: product.category ? product.category._id : "",
      condition: product.condition._id,
      description: product.description,
    },
  });

  const oldThumbnail = product.thumbnail,
    [oldGallery, setOldGallery] = useState(product.gallery);

  const { data: conditions } = useQuery({
    queryFn: () => getConditions(),
    queryKey: queryKeys.conditionsInForm,
  });

  const { data: categories } = useQuery({
    queryFn: () => getCategories(),
    queryKey: queryKeys.categoriesInForm,
  });

  const { data: productPurpose } = useQuery({
    queryFn: getPurposes,
    queryKey: queryKeys.productPurposes,
  });

  const productMutation = useMutation({ mutationFn: updateProduct });
  const uploadAssets = useMutation({ mutationFn: uploadFiles });

  const galleryImages = () => {
    const images = galleryPreview.map((item) => item.img);
    setValue("gallery", images);
    return images;
  };

  const previewGallery = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;

      const previews: { url: string; index: number; img: File }[] = [];

      for (let i = 0; i < files.length; i++) {
        const link = URL.createObjectURL(files[i]),
          imageIndex = Math.random();

        previews.push({ url: link, index: imageIndex, img: files[i] });
      }
      setGalleryPreview([...galleryPreview, ...previews]);
      galleryImages();
    }
  };

  const removeFromGallery = (index: number, fromOldGallery: boolean = false) => {
    if (fromOldGallery) {
      const newGallery = oldGallery.filter((_, i) => i !== index);
      setOldGallery(newGallery);
    } else {
      const newGallery = galleryPreview.filter((_, i) => i !== index);
      setGalleryPreview(newGallery);
      setValue(
        "gallery",
        getValues().gallery.filter((_: File, i: number) => i !== index),
      );
      galleryImages();
    }
  };

  const previewThumbnail = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const link = URL.createObjectURL(file);
      setThumbnailPreview(link);
      setValue("thumbnail", file);
    }
  };

  const submit = (data: createProductSchemaType) => {
    const ValidResult = createProductSchema.safeParse(data);
    if (ValidResult.success) {
      if (priceRequired && !data.price) {
        setError("price", {
          type: "manual",
          message: "Price is required",
        });
      } else {
        const form = document.querySelector("#productForm") as HTMLFormElement,
          files = galleryImages();
        if (form) {
          const thumbnailData = new FormData(),
            galleryData = new FormData();
          if (data.thumbnail) {
            thumbnailData.append("assets", getValues().thumbnail);
          }

          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              galleryData.append("assets", files[i]);
            }
          }

          uploadAssets.mutate(thumbnailData, {
            onSuccess(thumbnailResult: Array<string>) {
              uploadAssets.mutate(galleryData, {
                onSuccess(galleryResult) {
                  const oldGalleryArray = oldGallery.map((img) => img.url);
                  const newGallery = [
                    ...new Set(oldGalleryArray.concat(galleryResult)),
                  ];

                  const formData = {
                    ...data,
                    gallery: newGallery,
                    thumbnail: thumbnailResult.length
                      ? thumbnailResult
                      : [oldThumbnail],
                    id: product._id,
                  };

                  productMutation.mutate(formData, {
                    onSuccess() {
                      toast.success("Product updated!");
                      queryClient.invalidateQueries({
                        queryKey: queryKeys.productsInDashboard,
                      });
                      setIsOpen(false);
                      reset();
                    },
                  });
                },
              });
            },
          });
        }
      }
    }
  };

  const handlePurposeChange = (purposeId: string) => {
    setValue("purpose", purposeId);
    const selected = productPurpose?.find((purpose) => purpose._id == purposeId);
    if (selected?.slug.includes("DONAT")) {
      setPriceRequired(false);
    } else {
      setPriceRequired(true);
    }
  };

  useEffect(() => {
    if (productPurpose && priceRequired == undefined) {
      handlePurposeChange(product.purpose?._id || "");
    }
  }, [priceRequired, productPurpose, product]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      id='productForm'
      className='w-full space-y-3'
      encType='multipart/form,-data'
    >
      <div className='w-full space-y-4 sm:space-y-0 sm:flex sm:space-x-5'>
        <TextBox
          label='Product name'
          type='text'
          error={errors.name?.message}
          register={register("name")}
        />
        {priceRequired && (
          <TextBox
            label='Product price ($)'
            type='number'
            error={errors.price?.message}
            register={register("price")}
          />
        )}
      </div>

      <div className='w-full space-y-4 sm:space-y-0 sm:flex sm:space-x-5'>
        <div className='image-previews relative border border-gray-300 border-dashed rounded-xl w-full flex flex-col space-y-2'>
          <div className='p-4 w-full flex flex-wrap space-x-3'>
            <FileInput
              label='Thumbnail'
              id='thumbnail'
              withPreview={true}
              register={register("thumbnail", {
                onChange: (e) => {
                  previewThumbnail(e);
                },
              })}
            />
            {(oldThumbnail || thumbnailPreview) && (
              <img
                src={thumbnailPreview || oldThumbnail}
                alt='Image preview'
                className='w-24 h-24 rounded-md my-2'
              />
            )}
          </div>
          <div className='block w-full px-3 pt-0 absolute bottom-0 left-0'>
            {errors.thumbnail?.message && (
              <div className='block text-sm leading-6 text-red-500'>
                {errors.thumbnail.message as string}
              </div>
            )}
          </div>
        </div>
        <div className='w-full flex flex-col space-y-2'>
          {conditions && (
            <SelectOption
              error={errors.condition?.message}
              register={register("condition")}
              label='Condition'
              options={conditions.map((condition: ICondition) => ({
                value: condition._id,
                label: condition.name,
              }))}
            />
          )}
          {categories && (
            <SelectOption
              error={errors.category?.message}
              register={register("category")}
              label='Category'
              options={categories.map((category: ICategory) => ({
                value: category._id,
                label: category.name,
              }))}
            />
          )}
          {productPurpose && (
            <SelectOption
              error={errors.purpose?.message}
              register={register("purpose")}
              label='Purpose'
              options={productPurpose.map((purpose: IPurpose) => ({
                value: purpose._id,
                label: purpose.name,
              }))}
            />
          )}
        </div>
      </div>

      <div className='image-previews flex flex-wrap space-x-5 border border-gray-300 border-dashed rounded-xl p-4'>
        <FileInput
          label='Gallery'
          id='gallery'
          withPreview={true}
          allowMultiple={true}
          register={register("gallery", {
            onChange: (e) => {
              previewGallery(e);
            },
          })}
        />
        {oldGallery.length > 0 && (
          <>
            {oldGallery.map((img, index) => (
              <div className='relative' id={`image-${index}`} key={index}>
                <img
                  src={img.url}
                  alt='Image preview'
                  className='w-24 h-24 rounded-md my-2'
                />
                <span
                  className='absolute -top-1.5 -right-3 bg-white rounded-full p-1 cursor-pointer border border-gray-300'
                  onClick={() => removeFromGallery(index, true)}
                >
                  <XMarkIcon className='w-4 h-4' />
                </span>
              </div>
            ))}
          </>
        )}
        {galleryPreview.map((preview, index) => (
          <div className='relative' id={`image-${index}`} key={preview.index}>
            <img
              src={preview.url}
              alt='Image preview'
              className='w-24 h-24 rounded-md my-2'
            />
            <span
              className='absolute -top-1.5 -right-3 bg-white rounded-full p-1 cursor-pointer border border-gray-300'
              onClick={() => removeFromGallery(index)}
            >
              <XMarkIcon className='w-4 h-4' />
            </span>
          </div>
        ))}
      </div>
      <div className='w-full'>
        <TextArea
          label='Description'
          error={errors.description?.message}
          register={register("description")}
        />
      </div>

      <Button label='Submit' isLoading={productMutation.isPending} type='submit' />
    </form>
  );
};

export default UpdateProductForm;
