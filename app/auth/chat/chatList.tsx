import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import ScreenLayout from '@/components/screenLayout';
import MyObservationCard from '@/components/myObservationCard';
import ScreenTopNav from '@/components/screenTopNav';
import Pagination from '@/components/pagination';
import { useFocusEffect, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  GetConversationListResponse,
  useApiConversation,
} from '@/axios/api/conversation';
import { Observation } from '@/types/observation';

export default function ChatList() {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<GetConversationListResponse | null>(
    null
  );
  const [currentConversationPage, setCurrentConversationPage] = useState(1);

  const { getConversationList } = useApiConversation();
  const [refreshing, setRefreshing] = useState(false);

  const searchObservation = async (page?: number) => {
    if (page) {
      setCurrentConversationPage(page);
    }
    const conversationList = await getConversationList({
      pageSize: 6,
      page: page || currentConversationPage,
    });
    setConversations(conversationList || null);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await searchObservation(currentConversationPage);
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      searchObservation();
    }, [])
  );

  const backPathOnClick = () => {
    router.back();
  };

  return (
    <ScreenLayout>
      <ScreenTopNav
        title={t('chat')}
        backPathOnClick={backPathOnClick}
        isRoutable={false}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.mainBox}
      >
        {conversations ? (
          <FlashList
            estimatedItemSize={6}
            data={conversations.conversations}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item._id}
                onPress={() =>
                  router.push({
                    pathname: '/auth/chat',
                    params: { id: item._id },
                  })
                }
              >
                <MyObservationCard
                  observation={item as unknown as Observation}
                  isActions={false}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noObservationsBox}>
            <Text style={styles.textNoObservation}>{t('noObservationsHistoryYet')}</Text>
          </View>
        )}
      </ScrollView>
      <Pagination
        currentPage={currentConversationPage}
        count={conversations?.count || 0}
        onPageChange={searchObservation}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    marginTop: 20,
  },
  noObservationsBox: {
    marginTop: '70%',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 20,
  },
  textNoObservation: {
    fontSize: 16,
    lineHeight: 25,
    color: '#6D7176',
    textAlign: 'center',
  },
});
