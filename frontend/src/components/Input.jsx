const Input = ({
  type = "text",
  placeholder = "this is placeholder",
  className = "hey",
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`bg-[#3C364C] px-3 py-3 rounded-md border-0 outline-none focus:outline focus:ring-0 focus:border-0 outline-[#b3acc7] ring-0 focus-visible:outline ${className}`}
      {...props}
    />
  );
};

export default Input;
