import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import useModal, { UseModal } from '@/hooks/useModal';
import { Observation } from '@/types/observation';

export interface ObservationActionModalsContextValue {
  renameModal: UseModal;
  removeModal: UseModal;
  changeStatusModal: UseModal;
  editCommentModal: UseModal;
  changeAssigneeModal: UseModal;
  changeDeadlineModal: UseModal;
  changeCategoriesModal: UseModal;
  observationId: string | null;
  observation: Observation | null;
  setObservation: (observation: Observation | null) => void;
}

const ObservationActionModalsContext =
  createContext<ObservationActionModalsContextValue | null>(null);

interface ObservationActionModalsProviderProps {
  children: ReactNode;
}

export function ObservationActionModalsProvider({
  children,
}: ObservationActionModalsProviderProps) {
  const renameModal = useModal();
  const removeModal = useModal();
  const changeStatusModal = useModal();
  const editCommentModal = useModal();
  const changeAssigneeModal = useModal();
  const changeDeadlineModal = useModal();
  const changeCategoriesModal = useModal();

  const [observation, setObservation] = useState<Observation | null>(null);

  const value = useMemo<ObservationActionModalsContextValue>(
    () => ({
      renameModal,
      removeModal,
      changeStatusModal,
      editCommentModal,
      changeAssigneeModal,
      changeDeadlineModal,
      changeCategoriesModal,
      observationId: observation?._id || null,
      observation,
      setObservation,
    }),
    [
      renameModal,
      removeModal,
      changeStatusModal,
      editCommentModal,
      changeAssigneeModal,
      changeDeadlineModal,
      changeCategoriesModal,
      observation,
    ]
  );

  return (
    <ObservationActionModalsContext.Provider value={value}>
      {children}
    </ObservationActionModalsContext.Provider>
  );
}

export function useObservationActionModals(): ObservationActionModalsContextValue {
  const context = useContext(ObservationActionModalsContext);

  if (!context) {
    throw new Error(
      'useObservationActionModals must be used within ObservationActionModalsProvider'
    );
  }

  return context;
}
