import { Observation } from '@/types/observation';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { fileNameGenerator } from './nameConvent';
import * as Sharing from 'expo-sharing';
import { Image } from 'react-native';

const logoAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/logo.png')
);
const sloganAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/slogan.png')
);
console.log('🚀 ~ sloganAsset:', sloganAsset.height, sloganAsset.width);
const logoIconAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/logo-icon.png')
);
const contactsAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/contacts.png')
);

interface IGenerateObservationPdf {
  projectName: string;
  data: Observation[];
  showShare?: boolean;
  range: string;
  projectLocation: string;
}

const FILE_HEIGHT = 1217.5 * 1.5;
const FILE_WIDTH = 682 * 1.5;
const VERTICAL_MARGIN = 64;
const HORIZONTAL_MARGIN = 77;

const DARK_TEXT_COLOR = '#000000';
const LIGHT_TEXT_COLOR = '#8f8f8f';

export const generateObservationPdf = async ({
  projectName,
  data,
  range,
  showShare = false,
  projectLocation,
}: IGenerateObservationPdf): Promise<{
  uri: string | undefined;
}> => {
  const renderStyles = () => `
    <style>
      * { 
        print-color-adjust:exact !important;
      }
      html {
        height: 100%;
        padding: 0;
        margin: 0;
      }
      body {
        width: 100%;
        height: 100%;
        font-family: Arial, sans-serif;
        padding: 0;
        margin: 0;
        color: ${LIGHT_TEXT_COLOR};
        font-size: 26px;
        background-color: #ffffff;
      }
      header {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50px;
      }
      h1 {
        color: ${DARK_TEXT_COLOR};
        font-weight: 500;
        font-size: 37px;
        line-height: 65px;
        letter-spacing: -1.45px;
        vertical-align: middle;
      }
      h2 {
        padding-bottom: 4px;
        margin-bottom: 8px;
        font-size: 26px;
        font-weight: 400;
        line-height: 65px;
      }
      footer {
        height: 50px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;
      }
      hr {
        display:block; 
        height: 1px; 
        border: 0; 
        border-top: 1px solid #D9D9D9; 
        margin: 0; 
        padding: 0;
      }
      .text-value {
        color: ${DARK_TEXT_COLOR};
        font-weight: 400;
      }
      .observation-header {
        display: flex;
        align-items: center;
        height: 65px;
        font-weight: 500;
        font-size: 30px;
        width: 100%;
        background: #F0F0F0;
        color: ${DARK_TEXT_COLOR};
        padding: 0px 20px;
        margin-top: 62px;
      }
      .row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
        margin: 0 0 44px 0;
      }
      .row .field {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .field .value {
        color: ${DARK_TEXT_COLOR};
        font-weight: 400;
        margin-top: 8px;
      }
    </style>
  `;

  const renderPageHeader = () => `
    <header>
      <img width="${logoAsset.width / 2}" height="${logoAsset.height / 2}" src="${logoAsset.uri}" />
      <img width="${sloganAsset.width / 2}" height="${sloganAsset.height / 2}" src="${sloganAsset.uri}" />
    </header>
  `;

  const renderHeader = () => `
    <h1>Observations Report</h1>
    <h2>Project: <span class="text-value">${projectName || '-'}</span></h2>
    <hr />
  `;

  const renderFooter = () => `
    <footer>
      <div style="display: flex; flex-direction: row; gap: 10px; align-items: center;">
        <img style="width: ${logoIconAsset.width / 2}px; height: ${logoIconAsset.height / 2}px;" src="${logoIconAsset.uri}" />
        <img style="width: ${logoAsset.width / 2}px; height: ${logoAsset.height / 2}px;" src="${logoAsset.uri}" />
      </div>
      <img style="width: ${contactsAsset.width / 2}px; height: ${contactsAsset.height / 2}px;" src="${contactsAsset.uri}" />
    </footer>
  `;

  const renderObservationHeader = (index: number) => `
    <h4 class="observation-header">Observation ${index + 1}</h4>
  `;

  const renderObservationField = (label: string, value?: string) => `
    <div class="field">
      ${label}:
      <div class="value">${value || '-'}</div>
    </div>
  `;

  const renderObservationRow = (children: string) => `
    <div class="row">
      ${children}
    </div>
  `;

  const renderObservationPhotos = (urls: string[]) => `
    <div class="photos">
      ${urls
        .map(
          (url) =>
            `<div class="photo"><img style="max-height: 500px; width: 550px;" src="${url}" /></div>`
        )
        .join('')}
    </div>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        ${renderStyles()}
      </head>
      <body>
        ${renderPageHeader()}
        ${renderHeader()}
        
        ${data
          .map(
            (observation, index) => `
            ${renderObservationHeader(index)}
            ${renderObservationRow(`
              ${renderObservationField('Observation Name', observation.name)}
              ${renderObservationField('Date', observation.createdAt ? new Date(observation.createdAt).toLocaleDateString() : undefined)}
              ${renderObservationField('Reporter', observation.createdBy?.name)}
              ${renderObservationField('Location', projectLocation)}
            `)}

            ${renderObservationRow(`
              ${renderObservationField('General Contractor', observation.contractor)}
              ${renderObservationField('Sub Contractor', observation.subContractor)}
              ${renderObservationField('Category of Observation', observation.categories && observation.categories.length > 0 ? observation.categories.map((c) => c.name).join(', ') : observation.category?.toString())}
              ${renderObservationField('Status of Observation', observation.status)}
            `)}


            ${renderObservationRow(`
              ${renderObservationField('Assignee', observation.assignees?.map((a) => a.name || a.email).join(', '))}
              ${renderObservationField('Deadline to Complete', observation.deadline ? new Date(observation.deadline).toLocaleDateString() : undefined)}
              ${renderObservationField('Closed Date', observation.closeDate ? new Date(observation.closeDate).toLocaleDateString() : undefined)}
              ${renderObservationField('Follow Up', observation.implementedActions)}
            `)}

            ${renderObservationRow(`
              ${renderObservationField('Notes/Comments', observation.note)}
            `)}

            ${renderObservationRow('Observation Picture:')}
            ${renderObservationPhotos(observation.photoList || [])}
          `
          )
          .join('')}
         ${renderFooter()}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html,
    width: FILE_WIDTH,
    height: FILE_HEIGHT,
    margins: {
      top: VERTICAL_MARGIN,
      bottom: VERTICAL_MARGIN,
      left: HORIZONTAL_MARGIN,
      right: HORIZONTAL_MARGIN,
    },
  });

  const customName = fileNameGenerator(projectName, 'pdf', range);
  const newPath = FileSystem.documentDirectory + customName;
  if (showShare) {
    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });
    return { uri: newPath };
  } else {
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
