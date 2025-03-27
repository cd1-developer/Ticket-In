import { LoaderCircle } from "lucide-react";

export const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LoaderCircle
        className="animate-spin"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
};
