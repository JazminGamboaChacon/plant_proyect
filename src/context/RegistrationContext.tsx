import React, { createContext, useCallback, useContext, useState } from "react";

type RegistrationData = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  birthday: string;
  favoritePlantTypes: string[];
  photoBase64: string;
};

const empty: RegistrationData = {
  email: "",
  password: "",
  fullName: "",
  username: "",
  birthday: "",
  favoritePlantTypes: [],
  photoBase64: "",
};

type RegistrationContextType = {
  data: RegistrationData;
  updateData: (partial: Partial<RegistrationData>) => void;
  clearData: () => void;
};

const RegistrationContext = createContext<RegistrationContextType>({
  data: empty,
  updateData: () => {},
  clearData: () => {},
});

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RegistrationData>(empty);

  const updateData = useCallback((partial: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearData = useCallback(() => setData(empty), []);

  return (
    <RegistrationContext.Provider value={{ data, updateData, clearData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  return useContext(RegistrationContext);
}
