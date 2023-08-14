import React from "react";

const FormRow = ({
  type,
  name,
  placeholder,
  labelText,
  defaultValue,
  onChange,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-input"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default FormRow;
