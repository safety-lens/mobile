import ChangeStatus from '@/components/admin/modals/changeStatus';
import RenameObservation from '@/components/admin/modals/renameObservation';
import ChangeAssignee from '@/components/admin/modals/changeAssignee';
import ChangeDeadline from '@/components/admin/modals/changeDeadline';
import EditComment from '@/components/admin/modals/editComment';
import ChangeCategories from '@/components/admin/modals/changeCategories';
import { useSubscription } from '@/context/SubscriptionProvider';
import { useTranslation } from 'react-i18next';
import RemoveObservation from '@/components/admin/modals/removeObservation';
import { useObservationActionModals } from '@/context/ObservationActionModalsProvider';
import { useCallback } from 'react';

type Props = {
  projectId?: string;
  onUpdateObservation?: (id: string) => void; // or return the whole Observation object?
};

const ObservationActionModals = ({ projectId, onUpdateObservation }: Props) => {
  const { t } = useTranslation();
  const { hasSubscriptionFeature } = useSubscription();

  const {
    renameModal,
    removeModal,
    changeStatusModal,
    editCommentModal,
    changeAssigneeModal,
    changeDeadlineModal,
    changeCategoriesModal,
    observationId,
    observation,
  } = useObservationActionModals();

  const onUpdate = useCallback(() => {
    if (observationId) {
      onUpdateObservation?.(observationId);
    }
  }, [onUpdateObservation, observationId]);

  if (!observationId || !observation) {
    return null;
  }

  return (
    <>
      <ChangeStatus
        currentStatus={observation.status}
        observationId={observation._id}
        visible={changeStatusModal.isVisible}
        hideModal={changeStatusModal.hide}
        onUpdate={onUpdate}
      />
      <RenameObservation
        observationId={observation._id}
        value={observation.name}
        title={t('renameObservation')}
        visible={renameModal.isVisible}
        hideModal={renameModal.hide}
        onUpdate={onUpdate}
      />
      {hasSubscriptionFeature('teamInvitations') && (
        <ChangeAssignee
          id={projectId}
          observationId={observation._id}
          title={t('changeAssignee')}
          visible={changeAssigneeModal.isVisible}
          hideModal={changeAssigneeModal.hide}
          defaultValue={observation.assignees || []}
          onUpdate={onUpdate}
        />
      )}
      {hasSubscriptionFeature('teamInvitations') && (
        <ChangeDeadline
          observationId={observation._id}
          title={t('changeDeadline')}
          visible={changeDeadlineModal.isVisible}
          hideModal={changeDeadlineModal.hide}
          defaultValue={observation.deadline || new Date()}
          onUpdate={onUpdate}
        />
      )}
      <EditComment
        observationId={observation._id}
        value={observation.locationComment}
        title={t('editComment')}
        visible={editCommentModal.isVisible}
        hideModal={editCommentModal.hide}
        onUpdate={onUpdate}
      />
      <ChangeCategories
        observationId={observation._id}
        visible={changeCategoriesModal.isVisible}
        hideModal={changeCategoriesModal.hide}
        onUpdate={onUpdate}
        defaultValue={observation.categories?.map((item) => item.name) || []}
      />

      <RemoveObservation
        observationId={observation._id}
        observationName={`${observation.name || ''}`}
        title={t('deleteObservation')}
        visible={removeModal.isVisible}
        hideModal={removeModal.hide}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ObservationActionModals;
