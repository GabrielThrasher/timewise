export interface InputLabelProps {
  htmlFor: string;
  text: string;
}

function InputLabel({ htmlFor, text }: InputLabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm/6 font-medium">
      {text}
    </label>
  );
}

export default InputLabel;
