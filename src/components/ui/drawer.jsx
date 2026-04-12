"use client";

import { createContext, useContext, cloneElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const DrawerContext = createContext({ open: false, onOpenChange: () => {} });

export function Drawer({ open, onOpenChange, children }) {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerContent({ children, className = "" }) {
  const { open, onOpenChange } = useContext(DrawerContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)" }}
          />
          <motion.div
            key="drawer-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-background shadow-xl ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function DrawerHeader({ children, className = "" }) {
  return <div className={`px-4 pt-5 pb-2 ${className}`}>{children}</div>;
}

export function DrawerTitle({ children, className = "" }) {
  return <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>;
}

export function DrawerDescription({ children, className = "" }) {
  return <p className={`text-sm text-muted-foreground mt-1.5 ${className}`}>{children}</p>;
}

export function DrawerFooter({ children, className = "" }) {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
}

export function DrawerClose({ children, asChild }) {
  const { onOpenChange } = useContext(DrawerContext);

  const handleClose = (e) => {
    onOpenChange(false);
    children?.props?.onClick?.(e);
  };

  if (asChild && children) {
    return cloneElement(children, { onClick: handleClose });
  }

  return (
    <button type="button" onClick={() => onOpenChange(false)}>
      {children}
    </button>
  );
}
