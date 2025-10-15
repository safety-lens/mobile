import * as ImagePicker from 'expo-image-picker';
import { getValueStorage } from '@/utils/storage';
import { formDataFunc } from '@/utils/formData';
import { useApiUploads } from '@/axios/api/uploads';
import { ChatResponse, NewMessage } from '@/types/chatTypes';
import { UserAccountData } from '@/axios/api/auth';
import { useObservations } from '@/context/observationProvider';
import { useApiObservations } from '@/axios/api/observations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const dataLang = { en: 'English', es: 'Spanish' };

export default function useAnalyzerImage() {
  const { t } = useTranslation();
  const [startChatResponse, setStartChatResponse] = useState<ChatResponse | null>(null);

  const { uploads, isLoading: isLoadingUploads } = useApiUploads();
  const { setObservationResult } = useObservations();
  const { startChat, isLoading, getConversationId } = useApiObservations();

  const clearMessages = () => setStartChatResponse(null);

  const startAnalyzerImage = async (image: ImagePicker.ImagePickerAsset) => {
    if (image) {
      const accounts = await getValueStorage('accounts');
      const lang = (await getValueStorage('language')) as 'en' | 'es';
      const account: UserAccountData = JSON.parse(accounts || '');
      const formData = formDataFunc(image);

      await uploads({ file: formData })
        .then(async (e) => {
          if (e && e.url) {
            const message: NewMessage = {
              role: 'user',
              content: [
                {
                  text: t('analyzeImageForOshaViolations'),
                  type: 'text',
                  image_url: e,
                },
              ],
            };

            await getConversationId({ accountId: account.account.id }).then(
              async (data) => {
                if (!data) throw new Error('getConversationId error');
                await startChat({
                  conversation: data.id,
                  message,
                  language: dataLang[lang || 'en'],
                })
                  .then((resMessage) => {
                    if (resMessage) {
                      setStartChatResponse(resMessage);
                      setObservationResult(resMessage);
                      // setMessages(
                      //   account.user.accountRole === 'admin'
                      //     ? [message, resMessage.messages[0]]
                      //     : resMessage.messages
                      // );
                    }
                  })
                  .catch((error) =>
                    console.log('startChat error', error?.response || error)
                  );
              }
            );
          }
        })
        .catch((error) =>
          console.log('startAnalyzerImage error', error?.response || error)
        );
    }
  };

  return {
    startAnalyzerImage,
    startChatResponse,
    clearMessages,
    isLoading: isLoadingUploads || isLoading,
  };
}
