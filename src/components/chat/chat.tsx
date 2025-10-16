import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import Message from './message';
import NewObservation from '../observationNew';
import {
  ChatResponse,
  NewMessage,
  ResponseContentItem,
  Message as IMessage,
} from '@/types/chatTypes';
import { Colors } from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native-paper';
import { getValueStorage } from '@/utils/storage';
import { useApiObservations } from '@/axios/api/observations';
// import GradualAnimationTwo from '../GradualAnimation';
import { KeyboardAnimationTest } from '../GradualAnimationText';
import { useSubscription } from '@/context/SubscriptionProvider';

const dataLang = { en: 'English', es: 'Spanish' };
interface IChat {
  startChatResponse?: ChatResponse;
  loading?: boolean;
  clearMessages?: () => void;
}

export default function Chat({ startChatResponse, loading, clearMessages }: IChat) {
  const { t } = useTranslation();
  const { hasSubscriptionFeature } = useSubscription();

  const [searchText, setSearchText] = useState('');
  const [messages, setMessagesNew] = useState<IMessage[]>([]);

  const [loadedObservationImage, setLoadedObservationImage] = useState<string>('');

  const { id } = startChatResponse || {};

  const { startChat, isLoading } = useApiObservations();

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const sendMessage = async () => {
    if (!id) return;
    const lang = (await getValueStorage('language')) as 'en' | 'es';

    const message: NewMessage = {
      role: 'user',
      content: [
        {
          type: 'text',
          text: searchText,
        },
      ],
    };
    const messageResponse = await startChat({
      conversation: id,
      message,
      language: dataLang[lang || 'en'],
    });

    setMessagesNew(messageResponse?.messages || []);
    setSearchText('');
  };

  useEffect(() => {
    setMessagesNew(startChatResponse?.messages || []);

    const image = (
      startChatResponse?.messages[0]?.content as ResponseContentItem[]
    )?.find((item) => item.type === 'image_url')?.image_url?.url;

    if (image) {
      setLoadedObservationImage(image as string);
    }
  }, [startChatResponse]);

  return (
    <View style={styles.inner}>
      <FlatList
        data={messages}
        contentContainerStyle={{
          marginTop: 12,
          gap: 32,
          flexGrow: 1,
          flexDirection: 'column-reverse',
          // justifyContent: 'flex-end',
        }}
        keyboardDismissMode="interactive"
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <Message key={item.id} item={item} />}
        showsVerticalScrollIndicator={false}
        inverted={true}
      />
      {loading && <Text>...</Text>}
      <View>
        {loadedObservationImage && (
          <NewObservation
            loadedObservationImage={loadedObservationImage}
            clearMessages={clearMessages}
          />
        )}
        {hasSubscriptionFeature('chatWithAi') && (
          <View style={styles.searchInputField}>
            <TextInput
              mode="outlined"
              multiline={searchText.length > 30}
              outlineStyle={styles.textInputOutline}
              value={searchText}
              contentStyle={{
                color: 'black',
              }}
              textColor="black"
              onChangeText={handleSearch}
              right={
                <TextInput.Icon
                  icon="send"
                  forceTextInputFocus
                  onPress={searchText.trim().length === 0 ? undefined : sendMessage}
                  loading={isLoading}
                  color="white"
                  style={[
                    styles.sendButton,
                    { opacity: searchText.trim().length === 0 ? 0.5 : 1 },
                  ]}
                />
              }
            />
          </View>
        )}
        <View>
          <Text style={styles.disclaimerText}>{t('resultDisclaimer')}</Text>
        </View>
        {/* <GradualAnimationTwo /> */}
        <KeyboardAnimationTest value={230} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingBottom: 6,
    overflow: 'hidden',
  },

  disclaimerText: {
    marginVertical: 6,
    color: Colors.light.gray,
    textAlign: 'center',
  },
  searchInputField: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 14,
    marginTop: 12,

    ...Platform.select({
      ios: {
        shadowColor: '#CEB4FB85',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 14,
        elevation: 24,
      },
      android: {
        shadowColor: '#9055f6',
        elevation: 4,
      },
    }),
  },
  sendButton: {
    transform: [{ rotate: '-90deg' }],
    backgroundColor: '#022140',
  },
  textInputOutline: {
    display: 'none',
  },
});
