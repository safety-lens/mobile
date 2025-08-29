import { Observation } from '@/types/observation';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { fileNameGenerator } from './generateFiles/nameConvent';
import * as Sharing from 'expo-sharing';

interface IGenerateObservationPdf {
  projectName: string;
  data: Observation[];
  showShare?: boolean;
  range: string;
  projectLocation: string;
}

export const generateObservationPdf = async ({
  projectName,
  data,
  range,
  showShare = false,
  projectLocation,
}: IGenerateObservationPdf): Promise<{
  uri: string | undefined;
}> => {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 22px; margin-bottom: 10px; }
          p { font-size: 14px; margin: 4px 0; }
          .photo { margin: 10px 0; }
          img { width: 100%; max-width: 500px; border-radius: 8px; }
          .observation { padding-bottom: 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
          .projectName {padding-bottom: 4px; margin-bottom: 8px;}
          .block {display: flex; flex-direction: row; gap: 10px;}
          .block p {flex: 1; display: flex; flex-direction: column; gap: 4px;}
          .observationName {
            border-bottom: 1px solid #DFDDFA; 
            padding-bottom: 4px; 
            border-top-left-radius: 8px; 
            border-top-right-radius: 8px; 
            background-color: #FAFAFA;
            padding: 4px 8px;
          }
        </style>
      </head>
      <body>
        <h1>Project ${projectName} Report (${range})</h1>
        <p class="projectName">Project: ${projectName || '-'}</p>
        <p><b>Date range: </b> ${range}</p>
        ${(data as Observation[])
          .map(
            (observation: Observation, index: number) => `
          <div class="observation">
            <h4 class="observationName">Observation ${index + 1}</h4>
            <div class="block">
              <p><b>Observation Name:</b> ${observation.name || '-'}</p>
              <p><b>Date:</b> ${new Date(observation.createdAt).toLocaleDateString() || '-'}</p>
              <p><b>Reporter:</b> ${observation.createdBy?.name || '-'}</p>
              <p><b>Location:</b> ${projectLocation || '-'}</p>
            </div>

            <div class="block">
              <p><b>General Contractor:</b> ${observation.contractor || '-'}</p>
              <p><b>Sub Contractor:</b> ${observation.subContractor || '-'}</p>
              <p><b>Category of Observation:</b> ${observation.categories && observation.categories.length > 0 ? observation.categories.map((c) => c.name).join(', ') : observation.category}</p>
              <p><b>Status of Observation:</b> ${observation.status || '-'}</p>
            </div>

            <div class="block">
              <p><b>Assignee:</b> ${observation.assignees?.map((a) => a.name || a.email).join(', ') || '-'}</p>
              <p><b>Deadline to Complete :</b> ${observation.deadline ? new Date(observation.deadline).toLocaleDateString() : '-'}</p>
              <p><b>Closed Date:</b> ${observation.closeDate ? new Date(observation.closeDate).toLocaleDateString() : '-'}</p>
              <p><b>Follow Up:</b> ${observation.implementedActions || '-'}</p>
            </div>

            <div class="block">
              <p><b>Notes/Comments:</b> ${observation.note || '-'}</p>
            </div>
          </div>
            <h4>Observation Picture:</h4>
            ${observation.photoList
              .map(
                (url: string) =>
                  `<div class="photo"><img style="max-height: 500px; width: 550px;" src="${url}" /></div>`
              )
              .join('')}
        `
          )
          .join('')}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (showShare) {
    const customName = fileNameGenerator(projectName, 'pdf', range);
    const newPath = FileSystem.documentDirectory + customName;

    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });
    return { uri: newPath };
  } else {
    const customName = fileNameGenerator(projectName, 'pdf', range);
    const newPath = FileSystem.documentDirectory + customName;

    await FileSystem.copyAsync({
      from: uri,
      to: newPath,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(newPath);
    }
  }

  return { uri };
};
