import { Observation } from '@/types/observation';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { fileNameGenerator } from './nameConvent';
import * as Sharing from 'expo-sharing';
import { Image } from 'react-native';
import { calculateArialTextHeight } from './helpers';

const logoAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/logo.png')
);
const sloganAsset = Image.resolveAssetSource(
  require('../../../assets/images/pdf/slogan.png')
);
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

type LineRenderer = {
  renderer: () => string;
  height: number;
};

const PAPER_RATIO = 612 / 792;
const FILE_WIDTH = 1023;
const FILE_HEIGHT = FILE_WIDTH / PAPER_RATIO;
const SCALE_WORKAROUND = 1.5; // to fix wrong calculations, maybe the reason is viewport scaling in webview
const VERTICAL_MARGIN = 64;
const HORIZONTAL_MARGIN = 77;

const FONT_SIZE = 26;
const LINE_HEIGHT = 26 * 1.2;

const HEADER_MARGIN_BOTTOM = 50;
const HEADER_HEIGHT = logoAsset.height / 2;
const FOOTER_HEIGHT = 100;
const PROJECT_HEADER_HEIGHT = 136.2; // h1 + h2 + hr
const OBSERVATION_HEADER_MARGIN_TOP = 62;
const OBSERVATION_HEADER_HEIGHT = 65;
const OBSERVATION_ITEMS_GAP = 10;

const ROW_MARGIN_BOTTOM = 44;
const ROW_FIELD_MARGIN_TOP = 8;
const IMAGE_HEIGHT = 500;

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
    <style type="text/css">
      * { 
        print-color-adjust:exact !important;
      }
      html {
        height: 100%;
        width: 100%;
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
        font-size: ${FONT_SIZE}px;
        line-height: ${LINE_HEIGHT}px;
        background-color: #ffffff;
      }
      header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: ${HEADER_HEIGHT}px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: ${HEADER_MARGIN_BOTTOM}px;
      }
      h1 {
        color: ${DARK_TEXT_COLOR};
        font-weight: 500;
        font-size: 1.423rem;
        line-height: 2.7rem;
        vertical-align: middle;
      }
      h2 {
        padding-bottom: 4px;
        margin-bottom: 8px;
        font-size: 1rem;
        font-weight: 400;
        line-height: 2.5rem;
      }
      footer {
        flex: 1;
        bottom: ${VERTICAL_MARGIN}px;
        width: 100%;
        display: flex;
        align-items: flex-end;
        margin-top: 50px;
      }
      footer .wrapper {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
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
        height: ${OBSERVATION_HEADER_HEIGHT}px;
        font-weight: 500;
        font-size: 1.2rem;
        width: 100%;
        background: #F0F0F0;
        color: ${DARK_TEXT_COLOR};
        padding: 0px 20px;
        margin-top: ${OBSERVATION_HEADER_MARGIN_TOP}px;
      }
      .row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: ${OBSERVATION_ITEMS_GAP}px;
        margin: 0 0 ${ROW_MARGIN_BOTTOM}px 0;
      }
      .row .field {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .field .value {
        color: ${DARK_TEXT_COLOR};
        font-weight: 400;
        margin-top: ${ROW_FIELD_MARGIN_TOP}px;
      }
      .page {
        display: flex;
        min-height: 100%;
        min-width: 100%;
        flex-direction: column;
        padding: ${VERTICAL_MARGIN}px ${HORIZONTAL_MARGIN}px;
        box-sizing: border-box;
        page-break-after: always;
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
      <div class="wrapper">
        <div style="display: flex; flex-direction: row; gap: 10px; align-items: center;">
        <img style="width: ${logoIconAsset.width / 2}px; height: ${logoIconAsset.height / 2}px;" src="${logoIconAsset.uri}" />
        <img style="width: ${logoAsset.width / 2}px; height: ${logoAsset.height / 2}px;" src="${logoAsset.uri}" />
        </div>
        <img style="width: ${contactsAsset.width / 2}px; height: ${contactsAsset.height / 2}px;" src="${contactsAsset.uri}" />
      </div>
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
            `<div class="photo"><img style="max-height: 500px; width: 550px; object-fit: contain;" src="${url}" /></div>`
        )
        .join('')}
    </div>
  `;

  const renderPage = (children: string) => {
    return `
      <div class="page">
        ${children}
      </div>
    `;
  };

  const calculateMaxFieldHeight = (...texts: Array<string | undefined>) => {
    const realWidth = FILE_WIDTH * SCALE_WORKAROUND;
    const fieldWidth =
      (realWidth - HORIZONTAL_MARGIN * 2 - OBSERVATION_ITEMS_GAP * 3) / 4;
    const fontSize = FONT_SIZE;
    let maxHeight = 0;
    texts.forEach((text) => {
      const height = calculateArialTextHeight(
        text || '-',
        fontSize,
        LINE_HEIGHT,
        fieldWidth
      );
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    return maxHeight + FONT_SIZE + ROW_MARGIN_BOTTOM + ROW_FIELD_MARGIN_TOP;
  };

  const getObservationRenderers = (
    observation: Observation,
    index: number
  ): LineRenderer[] => {
    const renderers = [];

    renderers.push({
      renderer: () => renderObservationHeader(index),
      height: OBSERVATION_HEADER_HEIGHT + OBSERVATION_HEADER_MARGIN_TOP,
    });

    const observationName = observation.name;
    const createdAt = observation.createdAt
      ? new Date(observation.createdAt).toLocaleDateString()
      : undefined;
    const reporter = observation.createdBy?.name;
    const location = projectLocation;

    const contractor = observation.contractor;
    const subContractor = observation.subContractor;
    const categoryOfObservation =
      observation.categories && observation.categories.length > 0
        ? observation.categories.map((c) => c.name).join(', ')
        : observation.category?.toString();
    const statusOfObservation = observation.status;

    const assignee = observation.assignees?.map((a) => a.name || a.email).join(', ');
    const deadlineToComplete = observation.deadline
      ? new Date(observation.deadline).toLocaleDateString()
      : undefined;
    const closedDate = observation.closeDate
      ? new Date(observation.closeDate).toLocaleDateString()
      : undefined;
    const followUp = observation.implementedActions;
    const notesComments = observation.note;

    const firstRowHeight = calculateMaxFieldHeight(
      observationName,
      createdAt,
      reporter,
      location
    );

    const secondRowHeight = calculateMaxFieldHeight(
      contractor,
      subContractor,
      categoryOfObservation,
      statusOfObservation
    );

    const thirdRowHeight = calculateMaxFieldHeight(
      assignee,
      deadlineToComplete,
      closedDate,
      followUp
    );

    const fourthRowHeight = calculateMaxFieldHeight(notesComments);

    renderers.push({
      renderer: () =>
        renderObservationRow(`
          ${renderObservationField('Observation Name', observationName)}
          ${renderObservationField('Date', createdAt)}
          ${renderObservationField('Reporter', reporter)}
          ${renderObservationField('Location', location)}
        `),
      height: firstRowHeight,
    });

    renderers.push({
      renderer: () =>
        renderObservationRow(`
          ${renderObservationField('General Contractor', contractor)}
          ${renderObservationField('Sub Contractor', subContractor)}
          ${renderObservationField('Category of Observation', categoryOfObservation)}
          ${renderObservationField('Status of Observation', statusOfObservation)}
        `),
      height: secondRowHeight,
    });

    renderers.push({
      renderer: () =>
        renderObservationRow(`
          ${renderObservationField('Assignee', assignee)}
          ${renderObservationField('Deadline to Complete', deadlineToComplete)}
          ${renderObservationField('Closed Date', closedDate)}
          ${renderObservationField('Follow Up', followUp)}
        `),
      height: thirdRowHeight,
    });

    renderers.push({
      renderer: () =>
        renderObservationRow(`
          ${renderObservationField('Notes/Comments', notesComments)}
        `),
      height: fourthRowHeight,
    });

    renderers.push({
      renderer: () => renderObservationRow('Observation Picture:'),
      height: FONT_SIZE + ROW_MARGIN_BOTTOM,
    });

    renderers.push({
      renderer: () => renderObservationPhotos(observation.photoList || []),
      height: IMAGE_HEIGHT,
    });

    return renderers;
  };

  const renderPages = (observations: Observation[]) => {
    const pages: string[] = [];

    const lineRenderers = observations
      .map((observation, index) => {
        return getObservationRenderers(observation, index);
      })
      .flat();
    const realHeight = FILE_HEIGHT * SCALE_WORKAROUND;
    const pageHeight = realHeight - VERTICAL_MARGIN * 2;

    let availableHeight = pageHeight * 0.95; // leave some space to make sure everything fits
    let currentPage = 0;

    while (lineRenderers.length > 0) {
      const currentLine = lineRenderers.shift();
      if (!currentLine) break;
      // add new page to pages
      if (currentLine.height > availableHeight) {
        // start new page
        currentPage++;
        availableHeight = pageHeight;
      }
      // add line to current page
      if (!pages[currentPage]) {
        pages[currentPage] = '';
        pages[currentPage] += renderPageHeader();

        availableHeight -= HEADER_HEIGHT + HEADER_MARGIN_BOTTOM;
        if (currentPage === 0) {
          pages[currentPage] += renderHeader();
          availableHeight -= PROJECT_HEADER_HEIGHT;
        }
      }
      pages[currentPage] += currentLine.renderer();
      availableHeight -= currentLine.height;
    }

    // render footer on last page
    if (availableHeight < FOOTER_HEIGHT) {
      // not enough space, create new page
      currentPage++;
      pages[currentPage] = '';
    }
    pages[currentPage] += renderFooter();

    return pages.map((pageContent) => renderPage(pageContent)).join('');
  };

  const html = `
    <html>
      <head>
        ${renderStyles()}
      </head>
      <body>
        <div style="position: absolute; top: 0; left: 0; width: ${FILE_WIDTH * 1.5}px; height: ${FILE_HEIGHT * 1.5}px; background: #ffffff;"/>
        ${renderPages(data)}
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html,
    width: FILE_WIDTH,
    height: FILE_HEIGHT,
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
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
