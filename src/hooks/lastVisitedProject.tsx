import { useApiSignIn } from '@/axios/api/auth';
import { router } from 'expo-router';
import { useCallback } from 'react';

interface LastVisitedProject {
  openLastVisitedProject: () => Promise<void>;
}

export const useLastVisitedProject = (): LastVisitedProject => {
  const { getLastVisitedProject, getAccounts } = useApiSignIn();

  const openLastVisitedProject = useCallback(async () => {
    const accounts = await getAccounts();
    try {
      const result = await getLastVisitedProject(accounts?.user.id || '');
      if (result) {
        const { id, status } = result;
        if (status === 'Active') {
          router.replace(`/auth/projects/(id)/${id}`);
        } else {
          router.replace('/auth/projects');
        }
      } else {
        router.replace('/auth/projects');
      }
    } catch {
      router.replace('/auth/projects');
    }
    return;
  }, []);

  return { openLastVisitedProject };
};
