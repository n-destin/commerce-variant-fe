import { FC, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../types";
import { queryKeys } from "../../utils/queryKeys";
import { getChat } from "../../apis/chats";
import ChatBox from "./components/ChatBox";
import { ChatContext, IChatContext } from "../../context/Chat";

type IChat = {
  product: IProduct;
};
const ChatModel: FC<IChat> = ({ product }) => {
  console.log(product);
  const { setSelectedChat } = useContext(ChatContext) as IChatContext;
  const { data: chat, isFetched } = useQuery({
    queryKey: [queryKeys.chat, product._id],
    queryFn: () => getChat(product._id || ""),
  });

  useEffect(() => {
    if (isFetched && chat) {
      setSelectedChat(chat);
    }
  }, [isFetched, setSelectedChat, chat]);
  return <>{<ChatBox threadId={chat ? chat._id : ""} />}</>;
};
export default ChatModel;
