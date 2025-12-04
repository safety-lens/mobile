import { useCallback, useMemo } from 'react';
import DropdownItem from '../dropdown';
import { router } from 'expo-router';
import { useApiProject } from '@/axios/api/projects';
import { useTranslation } from 'react-i18next';
import { useObservations } from '@/context/observationProvider';
import useProjectsQuery from '@/hooks/queries/useProjectsQuery';
import { useProjects } from '@/context/projectsProvider';

export default function ProjectDropdown({
  currentId,
  redirect,
  onChange,
  label,
  placeholder,
}: {
  currentId?: string;
  redirect?: boolean;
  onChange?: (id: string, name?: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const projectsQuery = useProjectsQuery();
  const { setSingleProject } = useProjects();

  const { setObservation } = useObservations();
  const { getSingleProject } = useApiProject();
  const { t } = useTranslation();

  const allProjects = useMemo(() => {
    return projectsQuery.data
      ? projectsQuery.data.pages.flatMap((page) => page.projects)
      : [];
  }, [projectsQuery.data]);

  const fetchNextProjectsPage = useCallback(() => {
    if (projectsQuery.hasNextPage) {
      projectsQuery.fetchNextPage();
    }
  }, [projectsQuery]);

  const renamedData = useMemo(
    () =>
      allProjects.map((projects) => ({
        value: projects.id,
        label: projects.name,
      })),
    [allProjects]
  );

  const handleChange = async (id: string, name?: string) => {
    if (onChange) {
      onChange(id, name);
      return;
    }
    if (currentId === id) return;
    if (redirect) {
      // TODO: is it better instead of redirect prop to use callback here. not dropdown has more than single responsibility
      setSingleProject(null);
      setObservation({
        observations: [],
        count: 0,
        addressedCount: 0,
        inProgressCount: 0,
        notAddressedCount: 0,
      });
      router.navigate(`/auth/projects/(id)/${id}`);
    } else {
      await getSingleProject({ id });
    }
  };

  return (
    <DropdownItem
      search
      data={renamedData}
      defaultValue={currentId}
      onChange={(e) => handleChange(e.value, e.label)}
      label={label || t('chooseProject')}
      placeholder={placeholder || t('chooseProject')}
      onEndReached={fetchNextProjectsPage}
      isFetchingNextPage={projectsQuery.isFetchingNextPage}
    />
  );
}
