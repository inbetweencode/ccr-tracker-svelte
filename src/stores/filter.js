import { writable, derived } from 'svelte/store';
import { sortBy } from 'lodash-es';

import { areAllSelected, areAllUnselected } from '../utils/logic';

import {
  statusLevels,
  useCaseLevels,
  accessLevels,
  infrastructureLevels,
  architectureLevels,
} from '../utils/levels';
import { sortToEnd } from '../utils/misc';

function createMultiFilter() {
  const { subscribe, set, update } = writable([]);

  const init = (data, col = null) => {
    //console.log(data, col)
    let values = data;
    if (col !== null) {
      values = [
        ...new Set(
          data
            .map((d) => {
              return col.split('.').reduce((acc, cur) => acc[cur], d);
            })
            .flat()
        ),
      ];
      //console.log(values)
      values = sortBy(values, (d) => d.toLowerCase());
    }
    set(
      sortToEnd(
        values.map((value) => {
          return {
            id: value,
            name: value,
            selected: true,
          };
        }),
        'name',
        'Undecided'
      )
    );
  };

  const unselect = (id) =>
    update((f) =>
      f.map((d) => ({
        ...d,
        selected: [id].flat().includes(d.id) ? false : d.selected,
      }))
    );

  const unselectAll = () =>
    update((f) => f.map((d) => ({ ...d, selected: false })));

  const select = (id) =>
    update((f) =>
      f.map((d) => ({
        ...d,
        selected: [id].flat().includes(d.id) ? true : d.selected,
      }))
    );

  const selectOne = (id) => {
    unselectAll();
    select(id);
  };

  const selectAll = () =>
    update((f) => f.map((d) => ({ ...d, selected: true })));

  const click = (id) =>
    update((f) => {
      let res = [];
      if (areAllSelected(f)) {
        res = f.map((d) => ({
          ...d,
          selected: [id].flat().includes(d.id),
        }));
      } else {
        res = f.map((d) => ({
          ...d,
          selected: [id].flat().includes(d.id) ? !d.selected : d.selected,
        }));
      }
      if (areAllUnselected(res)) {
        res = res.map((d) => ({ ...d, selected: true }));
      }
      return res;
    });

  const applyBoolArray = (arr) => {
    const tmpArr = [...arr].reverse();
    update((f) =>
      f
        .reverse()
        .map((d, i) => ({
          ...d,
          selected: tmpArr[i] !== undefined ? tmpArr[i] : false,
        }))
        .reverse()
    );
  };

  return {
    subscribe,
    set,
    init,
    select,
    selectOne,
    selectAll,
    unselect,
    unselectAll,
    click,
    applyBoolArray,
  };
}

export const statusFilter = createMultiFilter();
export const countryFilter = createMultiFilter();
export const useCaseFilter = createMultiFilter();
export const technologyFilter = createMultiFilter();
export const architectureFilter = createMultiFilter();
export const infrastructureFilter = createMultiFilter();
export const accessFilter = createMultiFilter();
export const corporatePartnershipFilter = createMultiFilter();
export const crossborderPartnershipsFilter = createMultiFilter();

export const initFilters = (data) => {
  statusFilter.init(statusLevels.map((d) => d.name).filter(d => d != "Other"));
  countryFilter.init(data, 'country');
  //useCaseFilter.init(useCaseLevels.map((d) => d.name));
  //technologyFilter.init(data, 'categories.technology');
  //architectureFilter.init(architectureLevels.map((d) => d.name));
  //infrastructureFilter.init(infrastructureLevels.map((d) => d.name));
  //accessFilter.init(accessLevels.map((d) => d.name));
  //corporatePartnershipFilter.init(data, 'categories.corporate_partnership');
  //crossborderPartnershipsFilter.init(
  //  data,
  //  'categories.crossborder_partnerships'
  //);
};

export const filterByCategory = (category, name) => {
  switch (category) {
    case 'name':
      countryFilter.click(name);
      break;
    case 'new_status':
      statusFilter.click(name);
      break;
    case 'use_case':
      useCaseFilter.click(name);
      break;
    case 'technology':
      technologyFilter.click(name);
      break;
    case 'architecture':
      architectureFilter.click(name);
      break;
    case 'infrastructure':
      infrastructureFilter.click(name);
      break;
    case 'access':
      accessFilter.click(name);
      break;
    case 'corporate_partnership':
      corporatePartnershipFilter.click(name);
      break;
    case 'crossborder_partnerships':
      crossborderPartnershipsFilter.click(name);
      break;
  }
};

export const resetAllFilters = () => {
  statusFilter.selectAll();
  countryFilter.selectAll();
  useCaseFilter.selectAll();
  technologyFilter.selectAll();
  architectureFilter.selectAll();
  infrastructureFilter.selectAll();
  accessFilter.selectAll();
  corporatePartnershipFilter.selectAll();
  crossborderPartnershipsFilter.selectAll();
};

export const anyFilterActive = derived(
  [
    statusFilter,
    countryFilter,
    useCaseFilter,
    technologyFilter,
    architectureFilter,
    infrastructureFilter,
    accessFilter,
    corporatePartnershipFilter,
    crossborderPartnershipsFilter
  ],
  ([
    $statusFilter,
    $countryFilter,
    $useCaseFilter,
    $technologyFilter,
    $architectureFilter,
    $infrastructureFilter,
    $accessFilter,
    $corporatePartnershipFilter,
    $crossborderPartnershipsFilter
  ]) => {
    return !(
      areAllSelected($statusFilter) &&
      areAllSelected($countryFilter) &&
      areAllSelected($useCaseFilter) &&
      areAllSelected($technologyFilter) &&
      areAllSelected($architectureFilter) &&
      areAllSelected($infrastructureFilter) &&
      areAllSelected($accessFilter) &&
      areAllSelected($corporatePartnershipFilter) &&
      areAllSelected($crossborderPartnershipsFilter)
    );
  },
  false
);

export const applyParams = (params) => {
  if (!params || Object.keys(params).length === 0) return;

  const { status, useCase, architecture, infrastructure, access, country, corporatePartnership, crossborderPartnerships  } =
    params;

  statusFilter.applyBoolArray(status);
  useCaseFilter.applyBoolArray(useCase);
  architectureFilter.applyBoolArray(architecture);
  infrastructureFilter.applyBoolArray(infrastructure);
  accessFilter.applyBoolArray(access);
  //corporatePartnershipFilter.applyBoolArray(corporatePartnership);
  //crossborderPartnershipsFilter.applyBoolArray(crossborderPartnerships);

  if (country) {
    countryFilter.unselectAll();
    country.forEach((id) => {
      countryFilter.select(id);
    });
  }
};
