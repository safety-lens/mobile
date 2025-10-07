 
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { apiInstance } from '..';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

interface ApiResponse {
  s3Uri: string;
  url: string;
}

interface Uploads {
  file: FormData;
}

interface UseApiSignInReturn {
  uploads: (data: Uploads) => Promise<ApiResponse>;
  isLoading: boolean;
  error: string | null;
}

export const useApiUploads = (): UseApiSignInReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const showToast = (errorText: string) => {
    Toast.show({
      type: 'error',
      text1: t('error'),
      text2: errorText || 'Some error, try again',
    });
  };

  const handelError = (text: string) => {
    setError(text);
    showToast(text);
    console.error(text);
  };
  const uploads = async ({ file }: Uploads): Promise<ApiResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const response: AxiosResponse<ApiResponse> = await apiInstance({
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        url: '/uploads',
        data: file,
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data in response');
      }
    } catch (error: any) {
      console.log(error);
      handelError(error.response.data.message || 'error uploads');
      throw error; // Throwing the error to handle it in the calling code
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploads,
    isLoading,
    error,
  };
};
