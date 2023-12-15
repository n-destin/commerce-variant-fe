import { FC } from "react";
import { IChatDTO } from "../../../types";
import { format, isValid } from "date-fns";

type props = {
  chat: IChatDTO;
};
const Chat: FC<props> = ({ chat }) => {
  return (
    <div className='flex flex-col py-3 px-4 border-b'>
      <div className='flex space-x-3 items-center cursor-pointer'>
        <div className='pic flex items-center justify-center bg-teal-300 font-xl rounded-md'>
          <img
            src={chat?.product.thumbnail}
            alt={chat.product.name}
            className='w-10 h-10 rounded-md'
          />
        </div>
        <div className='chat-detail'>
          <div className='text-sm font-bold text-gray-900'>{chat.product.name}</div>
          <div className='text-sm font-md text-gray-400'>
            {isValid(new Date(chat?.createdAt))
              ? format(new Date(chat?.createdAt), "MMMM d, yyyy h:mm a")
              : "Invalid date"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
