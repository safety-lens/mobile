import React, { useCallback, useEffect, useMemo, useState } from 'react';
import 'react-native-reanimated';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import Message from '@/components/chat/message';
import { TextInput } from 'react-native-paper';
import { useApiObservations } from '@/axios/api/observations';
import useGetUserInfo from '@/hooks/getUserInfo';
import { Message as MessageType, NewMessage } from '@/types/chatTypes';
import ObservationHistory from '../../../assets/svgs/observationHistory';
import ScreenTopNav from '@/components/screenTopNav';
// import NewObservation from '@/components/observationNew';
// import ClipIcon from '../../../assets/svgs/clip';
import * as ImagePicker from 'expo-image-picker';
import { formDataFunc } from '@/utils/formData';
import { useApiUploads } from '@/axios/api/uploads';
// import GradualAnimationTwo from '@/components/GradualAnimation';
import { KeyboardAnimationTest } from '@/components/GradualAnimationText';
import { useSubscription } from '@/context/SubscriptionProvider';
import { useApiSignIn } from '@/axios/api/auth';
import { Typography } from '@/components/Typography';

export default function Chat() {
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);

  const [previewUri, setPreviewUri] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { id } = useLocalSearchParams();

  const { t } = useTranslation();
  const { user } = useGetUserInfo();
  const { getAccounts } = useApiSignIn();
  const {
    subscriptionFeatures,
    hasSubscription,
    hasSubscriptionFeature,
    subscriptionModal,
  } = useSubscription();

  const hasChatSubscription = useMemo(
    () => hasSubscriptionFeature('chatWithAi'),
    [hasSubscriptionFeature]
  );

  const { uploads, isLoading: isLoadingUploads } = useApiUploads();
  const { startChat, isLoading, getConversationId, getChat } = useApiObservations();

  const isDisabled = !hasChatSubscription;

  useFocusEffect(
    useCallback(() => {
      if (!hasSubscription) {
        getAccounts();
        return;
      }
      if (!subscriptionFeatures) {
        return;
      }
      if (!hasChatSubscription) {
        subscriptionModal.show();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subscriptionFeatures, hasChatSubscription])
  );

  const resetChat = () => {
    setMessages([]);
    setConversationId(null);
    setSearchText('');
    setPreviewUri(null);
    router.replace('/auth/projects');
  };

  const backPathOnClick = () => {
    if (messages.length > 0) {
      Alert.alert('Close Chat', 'You will lose your conversation', [
        { text: 'Cancel', style: 'cancel' },
        {
          style: 'destructive',
          text: 'Close',
          onPress: () => {
            resetChat();
          },
        },
      ]);
    } else {
      resetChat();
    }
  };

  const goToChats = () => {
    router.push('/auth/chat/chatList');
  };

  const getConversationIdData = async () => {
    if (conversationId) return conversationId;
    const res = await getConversationId({ accountId: user?.account.id || '' });
    setConversationId(res?.id || null);
    return res?.id || null;
  };

  const sendMessage = async () => {
    if (searchText.trim().length === 0) return;

    const formData = previewUri && formDataFunc(previewUri);
    const image = formData && (await uploads({ file: formData }));

    const idConversation = id || (await getConversationIdData());

    const message: NewMessage = {
      // role: user?.user.accountRole as 'user' | 'admin' | 'system' | 'assistant',
      role: 'user',
      content: [
        {
          type: 'text',
          text: searchText,
        },
        ...(image?.url
          ? [
              {
                type: 'image_url' as const,
                image_url: image,
              },
            ]
          : []),
      ],
    };
    const messageResponse = await startChat({
      conversation: idConversation as string,
      message,
      language: 'English',
    });

    setMessages(messageResponse?.messages || []);
    setPreviewUri(null);
    setSearchText('');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const getChatData = async () => {
    if (!id) return;
    const chat = await getChat(id as string);
    setMessages(chat?.messages || []);
  };

  useEffect(() => {
    getChatData();
  }, [id, conversationId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainBox}>
        <View style={{ backgroundColor: 'white', zIndex: 1000 }}>
          <ScreenTopNav
            icon={
              <TouchableOpacity onPress={goToChats}>
                <ObservationHistory />
              </TouchableOpacity>
            }
            title={t('chat')}
            backPathOnClick={backPathOnClick}
            isRoutable={false}
          />
        </View>
        {messages.length > 0 ? (
          <FlatList
            data={messages}
            contentContainerStyle={{
              marginHorizontal: 6,
              paddingVertical: 12,
              gap: 32,
              flexGrow: 1,
              flexDirection: 'column-reverse',
              justifyContent: 'flex-end',
            }}
            keyboardDismissMode="interactive"
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => <Message key={item.id} item={item} />}
            showsVerticalScrollIndicator={false}
            inverted={true}
          />
        ) : (
          <View style={styles.emptyChatContainer}>
            <Text style={styles.emptyChatText}>{t('howCanIAssistYouToday')}</Text>
          </View>
        )}

        <View style={styles.searchInputField} onTouchCancel={() => Keyboard.dismiss()}>
          <TextInput
            mode="outlined"
            multiline={searchText.length > 30}
            outlineStyle={styles.textInputOutline}
            value={searchText}
            style={[styles.textInput, isDisabled && { backgroundColor: 'black' }]}
            contentStyle={{
              color: 'black',
            }}
            textColor="black"
            onChangeText={handleSearch}
            disabled={isDisabled}
            right={
              <TextInput.Icon
                disabled={isDisabled}
                icon="send"
                forceTextInputFocus
                onPress={
                  searchText.trim().length === 0 && !previewUri?.uri
                    ? undefined
                    : sendMessage
                }
                loading={isLoading || isLoadingUploads}
                color={'white'}
                style={[
                  styles.sendButton,
                  {
                    opacity: searchText.trim().length === 0 && !previewUri?.uri ? 0.5 : 1,
                  },
                  isDisabled && styles.sendButtonDisabled,
                ]}
              />
            }
          />
        </View>

        <Typography center color="lighter" size="xxs" fullWidth={false}>
          {t('resultDisclaimer')}
        </Typography>
        <KeyboardAnimationTest value={240} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainBox: {
    paddingBottom: 5,
    paddingHorizontal: 15,
    flex: 1,
    overflow: 'hidden',
  },
  searchInputField: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 16,

    marginTop: 10,

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
        elevation: 10,
      },
    }),
  },

  sendButton: {
    transform: [{ rotate: '-90deg' }],
    backgroundColor: '#022140',
  },
  sendButtonDisabled: {
    backgroundColor: '#A4A9B4',
    opacity: 0.4,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInputOutline: {
    display: 'none',
  },
  textInput: {
    color: 'black',
    zIndex: 1000,
    // paddingLeft: 30,
  },
});
