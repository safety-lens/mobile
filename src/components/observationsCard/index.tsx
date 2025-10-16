import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import ChangeStatusButton from '../changeStatusButton';

import { Colors } from '@/constants/Colors';
import { IStatus, Observation } from '@/types/observation';
import { ListRenderItemInfo } from '@shopify/flash-list';
import { dateFormat, dateTimeFormat } from '@/utils/dateFormat';
import ObservationAction from '../observationAction';
import MessageMarkdown from '../messageMarkdown';
import MessageImage from '../messageImage';
import MapLocation from '../../../assets/svgs/mapLocation';
import { Href, Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/context/SubscriptionProvider';

interface IObservationsCard {
  observation: ListRenderItemInfo<Observation>;
}

const statusTitle = {
  'Not addressed': 'notAddressed',
  'In progress': 'inProgress',
  Addressed: 'addressed',
};

const PADDING = 24;
const DESCRIPTION_MAX_CHARACTERS = 200;

export default function ObservationsCard({ observation }: IObservationsCard) {
  const { t } = useTranslation();
  const { hasSubscriptionFeature } = useSubscription();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(100)).current;

  const imageUrl =
    typeof observation?.item?.conversationId?.messages?.[1]?.content !== 'string' &&
    observation?.item.photoList[0];

  const shouldShowExpand =
    !!observation.item.text && observation.item.text.length > DESCRIPTION_MAX_CHARACTERS;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const expandText = useMemo(() => {
    if (shouldShowExpand) {
      return !isExpanded ? `${t('showMore')}` : `${t('showLess')}`;
    }
    return '';
  }, [isExpanded, shouldShowExpand, t]);

  Animated.timing(animatedHeight, {
    //@ts-ignore
    toValue: !isExpanded ? '20%' : '100%',
    duration: 300,
    useNativeDriver: false,
  }).start();

  const push = () => {
    router.push({
      pathname: '/auth/projects/observationMap',
      params: {
        observations: observation.item._id,
        status: observation.item.status,
        observation: JSON.stringify(observation),
      },
    });
  };

  return (
    <View style={styles.cardBox}>
      <View>
        <View style={styles.statusBox}>
          <View style={styles.statusBoxLeft}>
            <View
              style={[
                styles.statusDot,
                styles[statusTitle[observation.item.status] as IStatus],
              ]}
            />
            <Text style={styles.statusString}>{observation.item.name}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ObservationAction
              observationId={observation.item.projectId}
              observation={observation.item}
              returnSameStatus={true}
            />
            <TouchableOpacity onPress={push}>
              <MapLocation />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.observationDate}>
          {dateFormat(observation.item.createdAt)}
        </Text>
      </View>
      <View style={styles.observationMain}>
        <Text style={styles.observationTitle}>{t('hazardsIdentified')}</Text>
        <Animated.ScrollView style={{ height: expandText ? animatedHeight : 'auto' }}>
          <MessageMarkdown
            text={observation.item.text?.slice(
              0,
              !isExpanded ? DESCRIPTION_MAX_CHARACTERS : Infinity
            )}
            customExpand={expandText}
            appendEllipsis={shouldShowExpand && !isExpanded}
            onChange={toggleExpand}
          />
        </Animated.ScrollView>

        <MessageImage imageUrl={imageUrl} />

        <View style={{ gap: 8 }}>
          {!!observation.item?.categories?.length && (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                flexWrap: 'wrap',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 4,
                  maxWidth: 320,
                }}
              >
                <Text style={styles.statusString}>Category:</Text>
                <View style={{ gap: 12 }}>
                  {observation.item?.categories?.map((category) => (
                    <View key={category.name} style={styles.categorySpecification}>
                      <Text>{category.name} </Text>
                      <Link href={category.links[0] as unknown as Href}>
                        <Text
                          style={[
                            styles.categorySpecificationText,
                            {
                              textDecorationLine: 'underline',
                            },
                          ]}
                        >
                          ({category.specification})
                        </Text>
                      </Link>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {hasSubscriptionFeature('teamInvitations') &&
            !!observation.item.assignees?.length && (
              <View style={styles.assigneesBox}>
                <Text style={styles.statusString}>{t('assignees')}: </Text>
                {observation.item.assignees?.map((assignee) => (
                  <Text key={assignee.email}>{assignee.email}</Text>
                ))}
              </View>
            )}

          {!!observation.item.deadline && (
            <View style={{ gap: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statusString}>{t('deadline')}:</Text>
              <Text>
                {observation.item.deadline && dateFormat(observation.item.deadline)}
                {', '}
                {dateTimeFormat(observation.item.deadline)}
              </Text>
            </View>
          )}

          {!!observation.item.closeDate && (
            <View style={{ gap: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statusString}>{t('closeDate')}:</Text>
              <Text>{dateFormat(observation.item.closeDate)}</Text>
            </View>
          )}

          {!!observation.item.contractor && (
            <View style={{ gap: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statusString}>{t('contractor')}:</Text>
              <Text>{observation.item.contractor}</Text>
            </View>
          )}

          {!!observation.item.subContractor && (
            <View style={{ gap: 4, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statusString}>{t('subContractor')}:</Text>
              <Text>{observation.item.subContractor}</Text>
            </View>
          )}
        </View>

        {observation.item.status === 'Addressed' && (
          <>
            <Text style={styles.observationTitle}>{t('correctiveActions')}</Text>
            <MessageMarkdown text={observation.item.implementedActions} />
          </>
        )}
      </View>
      <View style={styles.changeStatusButton}>
        <ChangeStatusButton
          status={observation.item.status}
          observation={observation.item}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBox: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: PADDING,
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
  assigneesBox: {
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categorySpecificationText: {
    color: Colors.light.icon,
    fontSize: 14,
    fontWeight: '500',
  },
  categorySpecification: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    maxWidth: 250,
  },
});
