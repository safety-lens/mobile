import { useApiSignIn } from '@/axios/api/auth';
import { useSubscription } from '@/context/SubscriptionProvider';
import { router } from 'expo-router';
import { useCallback } from 'react';

interface LastVisitedProject {
  openLastVisitedProject: () => Promise<void>;
}

export const useLastVisitedProject = (): LastVisitedProject => {
  const { getLastVisitedProject, getAccounts } = useApiSignIn();
  const { hasSubscription } = useSubscription();

  const openLastVisitedProject = useCallback(async () => {
    const accounts = await getAccounts();
    if (!hasSubscription) {
      router.replace('/auth/projects');
      return;
    }
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
