export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

const primaryBtnClass = `block bg-primary text-light w-full rounded-md py-1.5 mt-4 select-none hover:cursor-pointer hover:bg-primary-hover`;

function Button(props: ButtonProps) {
  const { className, children, ...rest } = props;

  return (
    <button className={`${primaryBtnClass} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
