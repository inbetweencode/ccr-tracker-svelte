import { readable, derived } from 'svelte/store';

import { loadTrackerData, loadTableData } from '../utils/load';

import {
  statusFilter,
  countryFilter,
  useCaseFilter,
  technologyFilter,
  architectureFilter,
  infrastructureFilter,
  accessFilter,
  corporatePartnershipFilter,
  crossborderPartnershipsFilter
} from './filter';
import { hasOverlap } from '../utils/logic';
import {
  categoryNameScale,
  statusColorScale,
  countryColorScale,
  useCaseColorScale,
  technologyColorScale,
  architectureColorScale,
  infrastructureColorScale,
  accessColorScale
} from '../stores/scales';
import styles from '../utils/styles';



// static test filter data & spotlight & new data
// const trackerDataPath = 'data/tracker-test-spotlight-new-data.csv';

// live data v2: add 'Overview Spotlight' + 'Key Developments Spotlight'
const trackerDataPath = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQh27kpYjCRmNoWa4FEpWqLSxLLaqK_hlgqP6wGQLp8Pum7guAYS6i0qt6wIRAPvb5Up6-6wvmTN05s/pub?gid=0&single=true&output=csv';

// live data v1
// const trackerDataPath = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRvC1JtWY8a2W4b8DLPfnfb9rmhuHBmWO22TvSXXpk25CZTBU9_8f6YtxM9rmBK2YajII5ltDE6ynGZ/pub?gid=0&single=true&output=csv';

// ignore
// const trackerDataPath = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgtFtB8hLrJ0VcWV9pASEAprK4foQsOHai9gWBNNzm4ZwATV35-gaoLm_7Q0FgGw1mXJ4sOhMDX5HW/pub?gid=0&single=true&output=csv'






/*
let dataHolder = [];

Airtable.configure({ apiKey: 'keyiBpVib7jEKXnEH' });

let base = new Airtable().base('app8reLMcbkJAuCOG');

base('Table data').select().eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.

  records.forEach(function(record) {
    let row = {
      Country: record.get('Country'),
      Status: record.get('Status'),
      Taxation: record.get('Taxation'),
      'AML/CFT': record.get('AML/CFT'),
      'Consumer Protection': record.get('Consumer Protection'),
      Privacy: record.get('Privacy'),
      Environment: record.get('Environment'),
    }
    console.log('Retrieved', row);
    dataHolder.push(row);

  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(err) {
  if (err) { console.error(err); return; }
});

//export const data2 = [];//derived([],);
*/



export const rawTableData = readable([], async (set) => {
  set(await loadTableData('Table data'));
});

export const data = derived(
  [
    rawTableData,
    statusFilter,
    countryFilter,
    useCaseFilter,
    technologyFilter,
    architectureFilter,
    infrastructureFilter,
    accessFilter,
    corporatePartnershipFilter,
    crossborderPartnershipsFilter,
  ],
  ([
     $rawTableData,
     $statusFilter,
     $countryFilter,
     $useCaseFilter,
     $technologyFilter,
     $architectureFilter,
     $infrastructureFilter,
     $accessFilter,
     $corporatePartnershipFilter,
     $crossborderPartnershipsFilter,
   ]) => {
    //console.log($rawTableData);
    return $rawTableData.map((d) => {
      return {
        ...d
      };
    });
  },
  []
);