import Skeleton from "react-loading-skeleton";
import { IChatDTO } from "../../../types";

type props = {
  chat?: IChatDTO;
  isLoading: boolean;
  isOwner: boolean;
};
const ChatHeader = ({ chat, isOwner, isLoading }: props) => {
  console.log(isLoading);
  return (
    <div className='h-16 bg-white flex items-center px-4 space-x-2 w-full'>
      {!chat && (
        <>
          <div className='flex space-x-2 items-center'>
            <Skeleton
              className='flex-1'
              height={45}
              width={45}
              enableAnimation={false}
            />
            <div className=''>
              <Skeleton
                className='flex-1'
                height={20}
                width={200}
                enableAnimation={false}
              />
              <Skeleton
                className='flex-1'
                height={16}
                width={100}
                enableAnimation={false}
              />
            </div>
          </div>
        </>
      )}
      {chat && (
        <>
          <div className='flex h-12 w-12'>
            <img
              src={chat.product.thumbnail}
              alt={chat.product.name}
              className='object-cover rounded-md'
            />
          </div>
          <div className=''>
            <div className='font-bold text-md capitalize text-gray-900'>
              {chat.product.name}
            </div>
            <div className='font-light text-sm'>
              {isOwner
                ? `${chat.buyer.displayName
                    .split(" ")[0]
                    .slice(0, 1)
                    .toUpperCase()}${chat.buyer.displayName
                    .split(" ")[1]
                    .charAt(0)
                    .toUpperCase()}`
                : `${chat.owner.displayName
                    .split(" ")[0]
                    .slice(0, 1)
                    .toUpperCase()}${chat.owner.displayName
                    .split(" ")[1]
                    .charAt(0)
                    .toUpperCase()}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
