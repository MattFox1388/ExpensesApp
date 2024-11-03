/* eslint-disable @typescript-eslint/naming-convention */
import * as FileSystem from 'expo-file-system';

import {
  readFile,
  csvJSON,
  filterEduResults,
  filterDiscResults,
} from '../CsvToJsonUtility';

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  // Add any other methods you're using from expo-file-system
}));

describe('CsvToJsonUtility', () => {
  describe('readFile', () => {
    it('should return null when path is undefined', async () => {
      const result = await readFile(undefined, false);
      expect(result).toBeNull();
    });
  });

  describe('csvJSON', () => {
    it('should correctly parse CSV data with commas enclosed in double quotes', () => {
      const csvInput = `"Name","Address","Description"
"John Doe","123 Main St, Apt 4","Software Engineer, JavaScript Expert"
"Jane Smith","456 Elm St","Product Manager, Agile Coach"`;

      const expectedOutput = [
        {
          Name: 'John Doe',
          Address: '123 Main St  Apt 4',
          Description: 'Software Engineer  JavaScript Expert',
        },
        {
          Name: 'Jane Smith',
          Address: '456 Elm St',
          Description: 'Product Manager  Agile Coach',
        },
      ];

      const result = csvJSON(csvInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should correctly process CSV files with varying number of columns per row', () => {
      const csvInput = `"Name","Age","City"
"John Doe","30","New York"
"Jane Smith","25"
"Bob Johnson","40","Los Angeles","CA"`;

      const expectedOutput = [
        {Name: 'John Doe', Age: '30', City: 'New York'},
        {Name: 'Jane Smith', Age: '25', City: ''},
        {Name: 'Bob Johnson', Age: '40', City: 'Los Angeles'},
      ];

      const result = csvJSON(csvInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle large CSV files without performance issues', () => {
      const largeCSV = generateLargeCSV(10000);
      const startTime = Date.now();
      const result = csvJSON(largeCSV);
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      expect(result.length).toBeGreaterThanOrEqual(10000);
      expect(executionTime).toBeLessThan(1000);
    });

    it('should handle CSV files with empty lines or whitespace-only lines', () => {
      const csvInput = `"Column1","Column2"
"Value1","Value2"


"Value3","Value4"
`;
      const expectedOutput = [
        {Column1: 'Value1', Column2: 'Value2'},
        {Column1: 'Value3', Column2: 'Value4'},
      ];
      const result = csvJSON(csvInput);
      expect(result).toEqual(expectedOutput);
    });

    it('should correctly process CSV data with special characters and Unicode content', () => {
      const csvInput = `"Name","Special Chars","Unicode"
"John Doe","!@#$%^&*()","こんにちは"
"Jane Smith","a,b,c","你好"`;
      const expectedOutput = [
        {
          Name: 'John Doe',
          'Special Chars': '!@#$%^&*()',
          Unicode: 'こんにちは',
        },
        {Name: 'Jane Smith', 'Special Chars': 'a b c', Unicode: '你好'},
      ];
      const result = csvJSON(csvInput);
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('filterEduResults', () => {
    it('should filter out results with empty Transaction ID for non-Discover transactions', () => {
      const testData = [
        {'Transaction ID': '123', Amount: '10.00'},
        {'Transaction ID': '', Amount: '20.00'},
        {'Transaction ID': '456', Amount: '30.00'},
        {'Transaction ID': undefined, Amount: '40.00'},
      ];

      const filteredResults = filterEduResults(testData);

      expect(filteredResults).toEqual([
        {'Transaction ID': '123', Amount: '10.00'},
        {'Transaction ID': '456', Amount: '30.00'},
      ]);
      expect(filteredResults.length).toBe(2);
    });
  });

  describe('filterDiscResults', () => {
    it('should filter out results with empty Trans. Date for Discover transactions', () => {
      const testData = [
        {'Trans. Date': '2023-05-01', Amount: '10.00'},
        {'Trans. Date': '', Amount: '20.00'},
        {'Trans. Date': '2023-05-03', Amount: '30.00'},
        {'Trans. Date': undefined, Amount: '40.00'},
      ];

      const filteredResults = filterDiscResults(testData);

      expect(filteredResults).toEqual([
        {'Trans. Date': '2023-05-01', Amount: '10.00'},
        {'Trans. Date': '2023-05-03', Amount: '30.00'},
      ]);
      expect(filteredResults.length).toBe(2);
    });
  });
});

function generateLargeCSV(rows: number): string {
  const header = '"Column1","Column2","Column3"\n';
  let csvContent = header;
  for (let i = 0; i < rows; i++) {
    csvContent += `"Value1,${i}","Value2,${i}","Value3,${i}"\n`;
  }
  return csvContent;
}
