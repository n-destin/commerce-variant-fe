import React, { FC, useContext, KeyboardEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { IMessage } from "../../../types";
import { socket } from "../../../utils/socket";
import { AuthContext } from "../../../context/Auth";
import TextBox from "../../common/inputs/TextBox";
import {
  messageSchema,
  messageSchemaType,
} from "../../../utils/schemas/chat.schema";

interface ChatFormProps {
  chatId?: string;
}

const ChatForm: FC<ChatFormProps> = ({ chatId }) => {
  const { register, handleSubmit, reset, formState } = useForm<messageSchemaType>({
    resolver: zodResolver(messageSchema),
  });
  const authCtx = useContext(AuthContext);

  const submit: SubmitHandler<messageSchemaType> = async (data) => {
    return new Promise((resolve) => {
      socket.emit(
        "send-message",
        { chat: chatId, ...data, sender: authCtx!.user!._id },
        (message: IMessage) => {
          reset();
          resolve(message);
        },
      );
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(submit)();
    }
  };

  return (
    <form
      className='flex w-full justify-between items-center'
      onSubmit={handleSubmit(submit)}
    >
      <TextBox
        type='text'
        register={register("text")}
        onKeyDown={handleKeyDown}
        customStyles={
          "py-3 px-4 w-full rounded-l-md rounded-r-none border-none ring-0 focus:ring-0 bg-white"
        }
      />
      <div className='self-end'>
        <button
          disabled={formState.isSubmitting}
          className='bg-teal-700 py-2.5 px-3 rounded-r-md h-full'
        >
          {formState.isSubmitting ? (
            <div className='text-white h-7'>sending..</div>
          ) : (
            <PaperAirplaneIcon className='w-7 h-7 text-white' />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
