import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "~/lib/utils";

interface BottomBorderInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const BottomBorderInput = forwardRef<HTMLInputElement, BottomBorderInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            "w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-700",
            "focus:ring-0 focus:outline-none focus:border-primary dark:focus:border-primary",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "transition-colors duration-200",
            error && "border-red-500 dark:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

BottomBorderInput.displayName = "BottomBorderInput";

export { BottomBorderInput };
