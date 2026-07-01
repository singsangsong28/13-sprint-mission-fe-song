export default function Button({ disabled, onClick, children }) {
  return (
    <button
      className={`rounded-[8px] px-[23px] py-[12px] text-white font-semibold whitespace-nowrap ${disabled ? "bg-gray-400" : "bg-primary-100"} cursor-pointer`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
