import { createContext, useContext, useState, ReactNode } from "react";

interface PreviewContextType {
  previewAsUser: boolean;
  setPreviewAsUser: (value: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewAsUser, setPreviewAsUser] = useState(false);

  return (
    <PreviewContext.Provider value={{ previewAsUser, setPreviewAsUser }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
}
