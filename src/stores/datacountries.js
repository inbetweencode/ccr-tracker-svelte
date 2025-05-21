import { derived } from 'svelte/store';
import { sortBy } from 'lodash-es';

import { data } from './data2';
import { projectedData, mapWidth, mapHeight, clusters } from './map';
import { colorCategory } from './colorcategory';
import { isDefined } from '../utils/logic';
import { getMinus, getColorFromCountries } from '../utils/geo';

//console.log(projectedData);
export const dataCountries = derived(
  [
    data,
    projectedData,
    mapWidth,
    mapHeight,
    clusters
  ], ([
    $data,
    $projectedData,
    $mapWidth,
    $mapHeight,
    $clusters
  ]) => {
  const availableCountries = $data.map(d => d.country);
  const dataCountries = sortBy($projectedData
    .flat()
    .filter(d => isDefined(d.path))
    .filter(d => availableCountries.includes(d.name))
    .map(d => {
      const datum = $data.find(dd => dd.country === d.name);
      return {
        ...d,
        ...datum,
        cluster: $clusters.find(cluster => cluster.countries.includes(datum.country))
      };
    }),
    [
      d => d.status
    ])
    .map((d, i) => {
      return {
        ...d,
        lineVisible: d.show && (d.centroid[0] > 0 && d.centroid[0] < $mapWidth && d.centroid[1] > 0 && d.centroid[1] < $mapHeight),
        orderId: i + 0.5,
        offset: d.isClusterMember ? getMinus(d.cluster.centroid, d.centroid) : [0, 0]
      };
    });
    return dataCountries;
  }, []);

  export const dataClusters = derived([clusters, dataCountries, colorCategory], ([$clusters, $dataCountries, $colorCategory]) => {
    return $clusters.map(cluster => {
      /*console.log(cluster);*/
      const countries = $dataCountries.filter(d => cluster.countries.includes(d.name.name));
      return {
        ...cluster,
        /*countries,*/
        show: countries.some(d => d.show),
        color: getColorFromCountries(countries, $colorCategory)
      };
    });
  });