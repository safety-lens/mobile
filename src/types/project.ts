
export type ProjectStatus = 'Archived' | 'Active';

export interface IProjectCart {
    id: string;
    name: string;
    country: string;
    city: string;
    address: string;
    zipCode: string;
    status: ProjectStatus;
    mainPhoto: string;
    projectNumber: string;
    user: {
      _id: string;
      name: string;
      email: string;
      status: string;
      role: string;
    };
    lastOpenedBy: {
      _id: string;
      name: string;
      email: string;
      status: string;
      role: string;
    };
    lastOpenedAt: string;
    createdAt: Date;
    updatedAt: Date;
    assignees?: string[];
  }

  export interface IGetProjects {
    projects: IProjectCart[];
    count: number;
  }

  export interface UpdateRes {
    address: string;
    city: string;
    country: string;
    createdAt: string;
    id: string;
    mainPhoto: string;
    name: string;
    projectNumber: string;
    status: string;
    updatedAt: string;
    user: string;
    zipCode: string;
    __v: string;
    url: string;
    description: string;
  }