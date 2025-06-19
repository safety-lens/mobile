import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Menu } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import RenameObservation from '../admin/modals/renameObservation';
import RemoveObservation from '../admin/modals/removeObservation';
import { Observation } from '@/types/observation';
import ChangeStatus from '../changeStatus';
import { useTranslation } from 'react-i18next';
import EditComment from '../admin/modals/editComment';

interface IObservationsCard {
  observation: Observation;
  observationId?: string;
  returnSameStatus?: boolean;
}

export default function ObservationAction({
  observation,
  observationId,
  returnSameStatus = false,
}: IObservationsCard) {
  const { t } = useTranslation();

  const [visibleMenu, setVisibleMenu] = useState(false);

  const [visibleRename, setVisibleRename] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [visibleChangeStatus, setVisibleChangeStatus] = useState(false);
  const [visibleEditComment, setVisibleEditComment] = useState(false);

  const openVisibleMenu = () => {
    setVisibleMenu(!visibleMenu);
  };

  const openChangeStatus = () => {
    setVisibleChangeStatus(!visibleChangeStatus);
    setVisibleMenu(false);
  };

  const showRenameModal = () => {
    setVisibleRename(!visibleRename);
    setVisibleMenu(false);
  };

  const showRemoveModal = () => {
    setRemoveModal(!removeModal);
    setVisibleMenu(false);
  };

  const showEditCommentModal = () => {
    setVisibleEditComment(!visibleEditComment);
    setVisibleMenu(false);
  };

  return (
    <View>
      <Menu
        contentStyle={styles.menuContentStyle}
        style={styles.menu}
        visible={visibleMenu}
        onDismiss={openVisibleMenu}
        anchor={
          <TouchableOpacity onPress={openVisibleMenu} style={styles.dotsBox}>
            <Text style={styles.dots}>...</Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={showRenameModal}
          title={t('rename')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={showEditCommentModal}
          title={t('editComment')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={openChangeStatus}
          title={t('changeStatus')}
        />
        <Menu.Item
          titleStyle={styles.menuItem}
          onPress={showRemoveModal}
          title={t('delete')}
        />
      </Menu>

      <ChangeStatus
        currentStatus={observation.status}
        observationId={observation._id}
        visible={visibleChangeStatus}
        hideModal={openChangeStatus}
        returnSameStatus={returnSameStatus ? observation : false}
      />
      <RenameObservation
        selectedStatus={observation.status}
        projectId={observationId}
        observationId={observation._id}
        value={observation.name}
        title={t('renameObservation')}
        visible={visibleRename}
        hideModal={showRenameModal}
      />
      <EditComment
        selectedStatus={observation.status}
        projectId={observationId}
        observationId={observation._id}
        value={observation.comment}
        title={t('editComment')}
        visible={visibleEditComment}
        hideModal={showEditCommentModal}
      />
      <RemoveObservation
        observationId={observation._id}
        observationName={`${observation.name || ''}`}
        title={t('deleteObservation')}
        visible={removeModal}
        hideModal={showRemoveModal}
        returnSameStatus={returnSameStatus ? observation : false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  statusBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusBoxLeft: {
    gap: 8,
    flexDirection: 'row',
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 100,
  },
  statusString: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 17,
    color: Colors.light.text,
  },
  observationDate: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.gray,
  },
  observationMain: {
    marginTop: 24,
    gap: 8,
  },
  observationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  observationBody: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.text,
  },
  changeStatusButton: {
    marginTop: 32,
  },
  addressed: {
    backgroundColor: '#2C875D',
  },
  inProgress: {
    backgroundColor: '#FFBF00',
  },
  notAddressed: {
    backgroundColor: '#FF0D31',
  },

  dotsBox: {
    paddingHorizontal: 10,
  },
  dots: {
    fontWeight: '900',
    fontSize: 30,
    marginTop: -18,
    color: Colors.light.text,
  },
  menuContentStyle: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  menu: {
    paddingTop: 25,
  },
  menuItem: {
    color: 'black',
  },
});
