import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { ObservationsResponse } from '@/types/observation';
import { ChatResponse } from '@/types/chatTypes';

type ObservationsContextType = {
  observation: ObservationsResponse;
  setObservation: Dispatch<SetStateAction<ObservationsResponse>>;
  singleObservation: ObservationsResponse | null;
  setSingleObservation: Dispatch<SetStateAction<ObservationsResponse | null>>;
  observationResult: ChatResponse | null;
  setObservationResult: Dispatch<SetStateAction<ChatResponse | null>>;
  currentObservationPage: number;
  setObservationCurrentPage: Dispatch<SetStateAction<number>>;
};

const ObservationContext = createContext<ObservationsContextType | undefined>(undefined);

function useObservations(): ObservationsContextType {
  const context = useContext(ObservationContext);
  if (!context) {
    throw new Error('useProjects must be used within a ObservationsProvider');
  }
  return context;
}

const ObservationsProvider = (props: { children: ReactNode }): ReactElement => {
  const [observation, setObservation] = useState<ObservationsResponse>({
    observations: [],
    count: 0,
    addressedCount: 0,
    inProgressCount: 0,
    notAddressedCount: 0,
  });
  const [singleObservation, setSingleObservation] = useState<ObservationsResponse | null>(
    null
  );
  const [observationResult, setObservationResult] = useState<ChatResponse | null>(null);
  const [currentObservationPage, setObservationCurrentPage] = useState(1);

  return (
    <ObservationContext.Provider
      {...props}
      value={{
        observation,
        setObservation,
        singleObservation,
        setSingleObservation,
        observationResult,
        setObservationResult,
        currentObservationPage,
        setObservationCurrentPage,
      }}
    />
  );
};

export { ObservationsProvider, useObservations };
