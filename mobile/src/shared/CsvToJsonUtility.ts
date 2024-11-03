/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as FileSystem from 'expo-file-system';

export const readFile = async (
  path: string | undefined,
  isDiscover: boolean,
): Promise<Record<string, string>[] | null> => {
  if (typeof path === 'undefined') {
    return null;
  }
  const response = await FileSystem.readAsStringAsync(path);
  let jsonifiedResponse = csvJSON(response);
  if (isDiscover) {
    jsonifiedResponse = filterDiscResults(jsonifiedResponse) as Record<
      string,
      string
    >[];
  } else {
    jsonifiedResponse = filterEduResults(jsonifiedResponse) as Record<
      string,
      string
    >[];
  }
  return jsonifiedResponse;
};

export const csvJSON = (csv: string): Record<string, string>[] => {
  // replae comma enclosed within double quotes
  const replacedCsv = csv.replace(
    /(["'])(?:(?=(\\?))\2.)*?\1/g,
    (match, capture) => {
      return match.replace(/,/g, ' ');
    },
  );

  const lines = replacedCsv.split('\n');

  const result: Record<string, string>[] = [];

  const headers = lines[0]
    .split(',')
    .map(header => replaceAll(header, '"', ''));

  for (let i = 1; i < lines.length; i++) {
    const obj: Record<string, string> = {};
    const currentline = lines[i]
      .split(',')
      .map(header => replaceAll(header, '"', ''));
    if (
      currentline.length === 0 ||
      (currentline.length === 1 && currentline[0] === '') ||
      currentline[0] === undefined
    ) {
      continue;
    }

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] =
        currentline[j] === undefined ? '' : currentline[j].trim();
    }
    result.push(obj);
  }

  return result;
};

export const filterEduResults = (results: Record<string, unknown>[]) => {
  const filteredResults = results.filter(item => {
    if (item['Transaction ID'] === '' || item['Transaction ID'] === undefined) {
      return false;
    }
    return true;
  });
  return filteredResults;
};

export const filterDiscResults = (results: Record<string, unknown>[]) => {
  const filteredResults = results.filter(item => {
    if (typeof item['Trans. Date'] === 'string' && item['Trans. Date'] === '') {
      return false;
    }
    return item['Trans. Date'] !== undefined;
  });
  return filteredResults;
};

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace);
}
