import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const PopupCard = ({
  isOpen,
  onClose,
  title,

  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.JSX.Element;
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="font-medium text-gray-800 border-b py-2">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
