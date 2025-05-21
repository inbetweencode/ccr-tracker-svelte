<script>
  import { tabledata } from '../../stores/tabledata';
  import { descriptions } from '../../stores/data2';
  import { hoveredIds, selectedDatum, selectedId, selectSource } from '../../stores/selection';
  import { onMount } from 'svelte';
  import Icon from 'svelte-awesome';
  import check from 'svelte-awesome/icons/check';
  import close from 'svelte-awesome/icons/close';
  import { information } from '../../utils/icons';
  import { questionMark } from '../../utils/icons';
  import { isVertical } from '../../stores/device';
  import { definitions, tooltip } from '../../stores/definitions';
  import Dropdown from '../Dropdown/Dropdown.svelte';
  import TableSelect from '../TableSelect/TableSelect.svelte';
  import {
    countryFilter,
    statusFilter,
  } from '../../stores/filter';
  import { getCoords } from '../../utils/misc';
  import InfoButton from '../TableSelect/InfoButton.svelte';

  export let tableModal;

  onMount(() => {
  });

  function handleRowClick(e, id) {
    if (e.touches && e.touches.length > 1) return;
    e.preventDefault();
    e.stopPropagation();
    selectedId.set(id); //4
    selectSource.set('table');
  }
  /*
  */

  let infoElem;
  let columns;
  $: {
    columns = [
      {
        name: 'Taxation',
        title: ( $descriptions.find(d => d.name === 'Taxation') || {} ).description
      },
      {
        name: 'AML/CFT',
        title: ( $descriptions.find(d => d.name === 'AML/CFT') || {} ).description
      },
      {
        name: 'Consumer Protection',
        title: ( $descriptions.find(d => d.name === 'Consumer Protection') || {} ).description
      },
      {
        name: 'Licensing',
        title: ( $descriptions.find(d => d.name === 'Licensing') || {} ).description
      },
    ];
  }


  let info = {
    "architecture": {
      "name": "Architecture",
      "title": "The legal structure of claims",
      "categories": [
        {
          "name": "Direct CBDC",
          "definition": "The CBDC is a direct claim on the central bank, which handles consumers’ retail payments and records all transactions, unlike cash."
        },
        {
          "name": "Hybrid CBDC",
          "definition": "This is an intermediate solution where the CBDC is a direct claim on the central bank but payments and real-time transactions are facilitated by financial intermediaries including commercial banks."
        },
        {
          "name": "Synthetic CBDC",
          "definition": "The CBDC is not a direct claim on the central bank; Claims are a liability of private financial institutions that facilitate payments and real-time transactions."
        }
      ]
    }
  };
  let tax;
</script>

<div class="table-wrapper">
<table>
  <thead>
  <tr class="">
    <th><TableSelect
      filter={countryFilter}
      label={'Country'}
      fullRollup={[]}
      rollup={[]}
      info={'some info text'}
      tooltip={tooltip}
      showReset
      showClickHint={`${$isVertical ? 'Tap' : 'Click'} to filter`}
    /></th>
    <th><TableSelect
      filter={statusFilter}
      label={'Status'}
      fullRollup={[]}
      rollup={[]}
      info={'some info text'}
      tooltip={tooltip}
      showReset
      showClickHint={`${$isVertical ? 'Tap' : 'Click'} to filter`}
    /></th>
    {#each columns as column}
      <th>{column.name}
        {#if column.title}
        <InfoButton
        info={column}
        tooltip={tooltip}
        />
        {/if}
      </th>
    {/each}
  </tr>
  </thead>
  <tbody>
  {#each $tabledata as row}
      <tr>
        <td>
          {#if tableModal}
          <span class='link'
            on:touchstart={(e) => handleRowClick(e, row.id)}
            on:click={(e) => handleRowClick(e, row.id)}
          >{row.country === 'United States of America' ? 'United States' : row.country}</span>
          {:else}
          <span class=''>{row.country === 'United States of America' ? 'United States' : row.country}</span>
          {/if}
        </td>
        <td>{row.status}</td>
        <td>
          {#if row.categories.taxation.bool === 'Yes'}<span class="check"><Icon data={check} /></span>{/if}
          {#if row.categories.taxation.bool === 'No'}<span class="close"><Icon data={close} /></span>{/if}
        </td>
        <td>
          {#if row.categories.aml_cft.bool === 'Yes'}<span class='check'><Icon data={check} /></span>{/if}
          {#if row.categories.aml_cft.bool === 'No'}<span class="close"><Icon data={close} /></span>{/if}
        </td>
        <td>
          {#if row.categories.consumer_protection.bool === 'Yes'}<span class='check'><Icon data={check} /></span>{/if}
          {#if row.categories.consumer_protection.bool === 'No'}<span class="close"><Icon data={close} /></span>{/if}
        </td>
        <td>
          {#if row.categories.licensing_disclosure.bool === 'Yes'}<span class='check'><Icon data={check} /></span>{/if}
          {#if row.categories.licensing_disclosure.bool === 'No'}<span class="close"><Icon data={close} /></span>{/if}
        </td>
      </tr>
  {/each}
  </tbody>
</table>
</div>


<style>

    .table-wrapper {
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
        /*margin: 30px;*/
        /*height: 50vw;*/
        /*max-height: 800px;*/
        overflow-y: scroll;
        margin: 0;
        height: 167vw;
        max-height: 499px;
    }
    table {
        width: 100%;
        /*border-collapse: collapse;*/
        position: relative;
    }
    thead {}
    th {
        color: #065697;
        font-weight: 700;
        background-color: white;
        position: sticky;
        top: 0;
    }
    td {
        color: #5A5D5E;
        font-weight: 400;
    }
    th, td {
        font-family: var(--primFont);
        font-size: 18px;
        border: 1px solid #EAECF1;
        border-top-style: none;
        border-left-style: none;
        padding: 20px 25px;
        width: 16.667%;
    }

    thead th {
        border-top: 0;
    }
    tbody tr:last-child td {
        border-bottom: 0;
    }
    th:first-child, td:first-child {
        border-left: 0;
        font-weight: 700;
    }
    th:last-child, td:last-child {
        border-right: 0;
    }

    tbody td span.link {
        cursor: pointer;
    }

    span.check,
    span.close {
        display: inline-block;
        background-color: #4BAE4F;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        color: white;
        padding: 4px 5px;
    }
    span.close {
        background-color: #B72951;
        padding: 3px 6px;
    }
    td:nth-of-type(n+3) {
        text-align: center;
    }


</style>