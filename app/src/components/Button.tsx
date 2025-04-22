export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  outline?: boolean;
}

// const primaryBtnClass = `block bg-primary text-light w-full rounded-md py-1.5 mt-4 select-none hover:cursor-pointer hover:bg-primary-hover`;
const primaryBtnClass = `block bg-primary text-light rounded-md select-none hover:cursor-pointer hover:bg-primary-hover`;
const outlineBtnClass = `block border-1 border-primary text-dark rounded-md select-none hover:cursor-pointer`;

function Button(props: ButtonProps) {
  const { className, children, outline, ...rest } = props;

  return (
    <button
      className={`${outline ? outlineBtnClass : primaryBtnClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
