import { derived } from 'svelte/store';
import { data } from './data2';


export const tabledata = derived(
  [
    data
  ],
  ([
     $data,
   ]) => {
    //console.log('output data');
    //console.log($data);
    return $data.sort((a, b) => a.country > b.country );
  }, []);
