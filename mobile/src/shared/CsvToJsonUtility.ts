import * as FileSystem from 'expo-file-system';

export const readFile = async (path: string | undefined, isDiscover: boolean): Promise<never[] | any>=> {
  if (typeof path === 'undefined') {
    console.log(`wrong path, path: ${path}`);
    return null;
  }
  const response = await FileSystem.readAsStringAsync(path);
  let jsonifiedResponse = csvJSON(response);
  if (!isDiscover) {
    jsonifiedResponse = filterEduResults(jsonifiedResponse);
  } else {
    jsonifiedResponse = filterDiscResults(jsonifiedResponse);
  }
  return jsonifiedResponse;
};

export const csvJSON = (csv: string): {}[]=> {
    //replae comma enclosed within double quotes
    console.log(`csv: ${csv}`);
    csv = csv.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match, capture) => {
        return match.replace(/,/g, ' ');
    }
    );

    const lines=csv.split("\n");
  
    const result = [];
  
    const headers=lines[0].split(",").map(header => replaceAll(header, '"', ''));
  
    for(let i=1;i<lines.length;i++){
  
        const obj = {};
        const currentline=lines[i].split(",").map(header => replaceAll(header, '"', ''));
  
        for(let j=0;j<headers.length;j++){
          if (currentline[j] === undefined) {
            obj[headers[j].trim()] = '';
          } else {
            obj[headers[j].trim()] = currentline[j].trim();
          }
        }
        result.push(obj);
  
    }
    
    console.log("csv to JSON result: ");
    console.log(result);
    return result;
  };

  export const filterEduResults = (results: {}[]) => {
    const filteredResults = results.filter(item => {
      if (item['Transaction ID'] === '' || item['Transaction ID'] === undefined) {
        return false;
      }
      return true;
     });
     return filteredResults;
  };

  export const filterDiscResults = (results: {}[]) => {
    const filteredResults = results.filter(item => {
      if (item['Trans. Date'] === '' || item['Trans. Date'] === undefined) {
        return false;
      }
      return true;
     });
     return filteredResults;
  };

  function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }