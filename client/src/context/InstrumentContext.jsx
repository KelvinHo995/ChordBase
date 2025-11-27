import { useContext, createContext } from "react";

const InstrumentContext = createContext('guitar');

export const useInstrument = () => useContext(InstrumentContext);

export function InstrumentProvider({ value, children }) {
    return (
        <InstrumentContext.Provider value={value}>
            {children}
        </InstrumentContext.Provider>
    )
}