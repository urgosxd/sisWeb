import { createContext, useContext, useState } from "react";
import { initialSession, Session } from "../models/session";

export const SessionContext = createContext<[Session, (session: Session) => void]>([initialSession, () => {}]);
export const useSessionContext = () => useContext(SessionContext);

interface Props {
  children: React.ReactNode
}

export const SessionContextProvider = ({children}:Props) => {
  const [sessionState, setSessionState] = useState(initialSession);
  const defaultSessionContext: [Session, typeof setSessionState]  = [sessionState, setSessionState];



  return (
    <SessionContext.Provider value={defaultSessionContext}>
      {children}
    </SessionContext.Provider>
  );
}
