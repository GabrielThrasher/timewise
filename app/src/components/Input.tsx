// https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/
export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {}

const inputClass = `block w-full py-1.5 px-2 focus:outline-none`;

function Input(props: InputProps) {
  const { className, ...rest } = props;

  return (
    <div
      className="flex items-center mt-1 rounded-md outline-1 
      outline-gray-200 -outline-offset-1 focus-within:outline-2 
        focus-within:-outline-offset-2 focus-within:outline-gray-300"
    >
      <input {...rest} className={`${inputClass} ${className}`} />
    </div>
  );
}

export default Input;
