import { useApiSignIn } from '@/axios/api/auth';
import { router } from 'expo-router';
import { useCallback } from 'react';

interface LastVisitedProject {
  openLastVisitedProject: () => void;
}

export const useLastVisitedProject = (): LastVisitedProject => {
  const { getLastVisitedProject, getAccounts } = useApiSignIn();

  const openLastVisitedProject = useCallback(async () => {
    const accounts = await getAccounts();
    await getLastVisitedProject(accounts?.user.id || '')
      .then(async (e) => {
        if (e) {
          const { id, status } = e;
          if (status === 'Active') {
            router.replace(`/auth/projects/(id)/${id}`);
          } else {
            router.replace('/auth/projects');
          }
        } else {
          router.replace('/auth/projects');
        }
      })
      .catch(() => {
        router.replace('/auth/projects');
      });
  }, []);

  return { openLastVisitedProject };
};
