import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

// import data from '../../components/listOfProjects/listProject.json';
import { IGetProjects, IProjectCart, ProjectStatus } from '@/types/project';
import useProjectsQuery from '@/hooks/queries/useProjectsQuery';

type ProjectsContextType = {
  projects: IGetProjects;
  observationImage: string;
  setObservationImage: Dispatch<React.SetStateAction<string>>;
  setProjects: Dispatch<SetStateAction<IGetProjects>>;

  singleProjects: IProjectCart | null;
  setSingleProject: Dispatch<SetStateAction<IProjectCart | null>>;

  statusFilter: ProjectStatus;
  setStatusFilter: Dispatch<SetStateAction<ProjectStatus>>;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

function useProjects(): ProjectsContextType {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}

const ProjectsProvider = (props: { children: ReactNode }): ReactElement => {
  /**
   * @deprecated Use react-query useProjectsQuery instead
   */
  const [projects, setProjects] = useState<IGetProjects>({ projects: [], count: 0 });
  const [singleProjects, setSingleProject] = useState<IProjectCart | null>(null);
  const [observationImage, setObservationImage] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>('Active');

  return (
    <ProjectsContext.Provider
      {...props}
      value={{
        projects,
        setProjects,
        observationImage,
        setObservationImage,
        singleProjects,
        setSingleProject,
        statusFilter,
        setStatusFilter,
      }}
    />
  );
};

export { ProjectsProvider, useProjects };
