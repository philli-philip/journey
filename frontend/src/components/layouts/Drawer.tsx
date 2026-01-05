import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function PreparedDrawer({
  title = "New drawer",
  description,
  children,
  open = false,
  onClose,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}) {
  const [, setSearchParams] = useSearchParams();
  return (
    <Drawer direction="right" dismissible={true} open={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <DrawerClose asChild>
          <Button
            className="absolute top-2 right-2"
            variant="outline"
            size="icon"
            onClick={() => (onClose ? onClose() : setSearchParams({}))}
          >
            <X />
          </Button>
        </DrawerClose>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
