import React, { createContext, useState, ReactNode } from "react";

type TypeAlarm = {
    id: number;
    date: string;
    time: string;
    enabled: boolean;
  };

interface GlobalContextType {
  alarms: TypeAlarm[];
  setAlarms: React.Dispatch<React.SetStateAction<any[]>>;
}

export const GlobalContext = createContext<GlobalContextType>({alarms: [], setAlarms: () => {}});

// Create the provider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<TypeAlarm[]>([]);

  return (
    <GlobalContext.Provider value={{ alarms, setAlarms }}>
      {children}
    </GlobalContext.Provider>
  );
};
