

export function fileNameGenerator(projectName: string, type: string, range?: string) {
  return `${projectName.replace(/[^a-z0-9]/gi, '_')}_Date_${range?.replace(/[^a-z0-9]/gi, '_') || ''}.${type}`;
}