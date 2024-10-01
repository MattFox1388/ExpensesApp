import {csvJSON} from '../CsvToJsonUtility';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('CsvToJsonUtility', () => {
    it('converts csv to json', () => {
        const csvFile = readFileSync(resolve(__dirname, '../resources/test.csv'), 'utf8');
        const json = csvJSON(csvFile);
        const jsonObject = JSON.parse(json);
        expect(jsonObject[0]['Posting Date']).toBe("1/24/2022");
        expect(jsonObject.length).toBe(1);
    });
});