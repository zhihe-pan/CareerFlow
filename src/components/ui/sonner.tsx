import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      duration={4000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass group-[.toaster]:text-foreground group-[.toaster]:rounded-xl group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:text-foreground",
          description: "group-[.toast]:text-sm group-[.toast]:text-muted-foreground group-[.toast]:mt-0.5",
          content: "group-[.toast]:gap-1",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:border-white/10 group-[.toast]:bg-background/80 group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
