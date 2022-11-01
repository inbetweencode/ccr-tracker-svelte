import { csv, json } from 'd3';
import { initFilters } from '../stores/filter';
import Airtable from 'airtable';


const splitValue = (value) =>
  value
    .split(',')
    .map((d) => d.trim())
    .map((d) => d === '' ? 'Undecided' : d);

const curate = (value) => {
  if (!value) return 'Undecided';
  return value.replace('n/a', 'Undecided');
};

export const loadTrackerData = async (dataPath) => {
  // load and format the data
  const data = await csv(dataPath, (d) => {
    let mediaSources;
    if (d['Media Sources'] !== undefined) {
      mediaSources = d['Media Sources'].split(';').filter(dd => dd);
    } else {
      mediaSources = '';
    }
    return {
      owner: d.Owner,
      name: d.Name,
      currency_name: d['Name of CBDC'],
      overview: d.Overview,
      overview_spotlight: d['Overview Spotlight'],
      key_developments: d['Key Developments'],
      key_developments_spotlight: d['Key Developments Spotlight'],
      categories: {
        // former version
        // new_status: curate(d['New Status']),
        new_status: curate(d['October Status']),
        use_case: curate(d['Use case']),
        technology: curate(d['Underlying technology']),
        architecture: curate(d['Architecture: direct CBDC or hybrid']),
        infrastructure: curate(d['Infrastructure: DLT or conventional']),
        access: curate(d['Access: token or account']),
        corporate_partnership: curate(d['Technology partnership']),
        crossborder_partnerships: curate(d['Cross-border projects']),
      },
      sources: {
        central_bank_name: d['Central Bank Name'],
        central_bank_url: d['Central Bank Source to Hyperlink'],
        // media_urls: d['Media Sources'].split(';').filter(dd => dd)
        media_urls: d['Media Sources'].split(';').filter(dd => dd)
      },
      notes: d.Notes,
    };
  });

  // filter for valid entries
  const filteredData = data
    .filter(
      (d) => d.categories.new_status !== 'not available'
    )
    .filter(
      (d) => d.categories.new_status !== 'Undecided'
    )
    .filter(
      (d) => d.categories.new_status !== 'No development yet'
    );

  // initialize the filters
  initFilters(filteredData);

  return filteredData;
};

export const loadJson = async (dataPath) => {
  return await json(dataPath);
};

export const loadNaturalEarth = async (dataPath) => {
  const { features } = await json(dataPath);
  return features.map(d => {
    return {
      ...d,
      properties: {
        name: d.properties.ADMIN
      }
    };
  });
};

export const loadCapitals = async (dataPath) => {
  return await csv(dataPath);
};






let dataHolder = [];

Airtable.configure({ apiKey: 'keyiBpVib7jEKXnEH' });

let base = new Airtable().base('app8reLMcbkJAuCOG');

/*
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
*/

const curateBoolean = (value) => {
  if (typeof value === 'undefined') return false;
  return value;
};

const curateString = (value) => {
  if (typeof value === 'undefined') return '';
  return value;
};



export const loadTableData = async (table) => {
  // load and format the data
  const data = await base('Table data').select().all().then(records => {
    let rows = records.map(function(record,index, array){
      return {
        country: record.get('Country'),
        status: curateString(record.get('Status')),
        taxation: curateBoolean(record.get('Taxation')),
        aml_cft: curateBoolean(record.get('AML/CFT')),
        consumer_protection: curateBoolean(record.get('Consumer Protection')),
        licensing_disclosure: curateBoolean(record.get('Licensing and Disclosure')),
      };
    });
    //console.log(records);
    return rows;
  });

  return data;

  /*
  await csv(dataPath, (d) => {
    let mediaSources;
    if (d['Media Sources'] !== undefined) {
      mediaSources = d['Media Sources'].split(';').filter(dd => dd);
    } else {
      mediaSources = '';
    }
    return {
      owner: d.Owner,
      name: d.Name,
      currency_name: d['Name of CBDC'],
      overview: d.Overview,
      overview_spotlight: d['Overview Spotlight'],
      key_developments: d['Key Developments'],
      key_developments_spotlight: d['Key Developments Spotlight'],
      categories: {
        // former version
        // new_status: curate(d['New Status']),
        new_status: curate(d['October Status']),
        use_case: curate(d['Use case']),
        technology: curate(d['Underlying technology']),
        architecture: curate(d['Architecture: direct CBDC or hybrid']),
        infrastructure: curate(d['Infrastructure: DLT or conventional']),
        access: curate(d['Access: token or account']),
        corporate_partnership: curate(d['Technology partnership']),
        crossborder_partnerships: curate(d['Cross-border projects']),
      },
      sources: {
        central_bank_name: d['Central Bank Name'],
        central_bank_url: d['Central Bank Source to Hyperlink'],
        // media_urls: d['Media Sources'].split(';').filter(dd => dd)
        media_urls: d['Media Sources'].split(';').filter(dd => dd)
      },
      notes: d.Notes,
    };
  });
  */

}

