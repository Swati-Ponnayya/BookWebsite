export const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  error,
  min,
  max,
  labelPosition = "top", // "top" or "left"
}) => {
  const isLabelLeft = labelPosition === "left";

  return (
    <div
      className={`mb-4 ${
        isLabelLeft ? "flex items-center gap-2" : "flex flex-col"
      }`}
    >
      <label className="text-sm font-medium text-gray-700 min-w-[80px]">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-[#8E6547] rounded-md"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className="w-full px-3 py-2 border border-[#8E6547] rounded-md"
        />
      )}
      {error && (
        <p className={`text-red-500 text-sm ${isLabelLeft ? "ml-[85px]" : ""}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  labelPosition = "top", // "top" or "left"
}) => {
  const isLabelLeft = labelPosition === "left";

  return (
    <div
      className={`mb-4 ${
        isLabelLeft ? "flex items-center gap-2" : "flex flex-col"
      }`}
    >
      <label className="text-sm font-medium text-gray-700 min-w-[80px]">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-[#8E6547] rounded-md"
      >
        <option value="">Select Category</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className={`text-red-500 text-sm ${isLabelLeft ? "ml-[85px]" : ""}`}>
          {error}
        </p>
      )}
    </div>
  );
};
