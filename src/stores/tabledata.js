import { derived } from 'svelte/store';
import { data } from './data2';

import { projectedData } from './map';
import { useCapitalCountries } from '../utils/geo';

export const tabledata = derived(
  [
    data,
    projectedData
  ],
  ([
     $data,
     $projectedData
   ]) => {

    //console.log('output data');
    //console.log($data);
    //console.log($projectedData);

    return $data.sort((a, b) => a.country > b.country ).map((d, i) => {
      return {
        ...d,
        id: ( ($projectedData.find(datum => datum.name === d.country))||{id: null} ).id,
      }
    });
  }, []);
