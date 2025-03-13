
import React from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";

const FormItem = ({ children, className, ...props }) => {
  return (
    <div className={classNames("p-field mb-3", className)} {...props}>
      {children}
    </div>
  );
};

const FormLabel = ({ children, className, htmlFor, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames("p-component p-text-secondary block mb-1", className)}
      {...props}
    >
      {children}
    </label>
  );
};

const FormDescription = ({ children, className, ...props }) => {
  return (
    <small
      className={classNames("p-text-secondary block mt-1", className)}
      {...props}
    >
      {children}
    </small>
  );
};

const FormMessage = ({ children, className, error, ...props }) => {
  if (!error && !children) return null;
  
  const message = error || children;
  
  return (
    <small
      className={classNames("p-error block mt-1", className)}
      {...props}
    >
      {message}
    </small>
  );
};

export {
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
};
