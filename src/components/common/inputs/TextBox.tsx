import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextBox {
  label?: string;
  type: string;
  register?: UseFormRegisterReturn;
  error?: string;
  customStyles?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextBox: FC<ITextBox> = ({
  label,
  type,
  register,
  error,
  value = "",
  disabled = false,
  onChange,
  onKeyDown,
  placeholder,
  customStyles,
}) => {
  return (
    <div className='block w-full relative'>
      {label && (
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          {label}
        </label>
      )}
      <div className='mt-2 min-w-full'>
        <input
          {...register}
          type={type}
          defaultValue={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={` block min-w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-teal ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none ${customStyles}`}
          {...(disabled ? { disabled: true } : {})}
          placeholder={placeholder}
        />
        <label className='block text-sm leading-6 text-red-500'>{error}</label>
      </div>
    </div>
  );
};

export default TextBox;
