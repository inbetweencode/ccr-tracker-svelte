<script>
  import { tabledata } from '../../stores/tabledata';
  import { onMount } from 'svelte';
  import Icon from 'svelte-awesome';
  import check from 'svelte-awesome/icons/check';
  import { information } from '../../utils/icons';
  import { questionMark } from '../../utils/icons';
  import { isVertical } from '../../stores/device';
  import { definitions, tooltip } from '../../stores/definitions';
  import Dropdown from '../Dropdown/Dropdown.svelte';
  import TableSelect from '../TableSelect/TableSelect.svelte';
  import {
    countryFilter,
  } from '../../stores/filter';
  import { getCoords } from '../../utils/misc';
  import InfoButton from '../TableSelect/InfoButton.svelte';


  onMount(() => {
  });

  let infoElem;
  let columns = [
    {
      name: 'Taxation',
      title: 'Is taxation handled?'
    },
    {
      name: 'AML/CFT',
      title: ''
    },
    {
      name: 'Consumer Protection',
      title: ''
    },
    {
      name: 'Licensing and Disclosure',
      title: ''
    },
  ];

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
</script>

<div class="table-wrapper">
<table>
  <thead>
  <tr class="">
    <th>Country</th>
    <th><TableSelect
      filter={countryFilter}
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
    <td>{row.country}</td>
    <td>{row.status}</td>
    <td>{#if row.taxation}<span class="check"><Icon data={check} /></span>{/if}</td>
    <td>{#if row.aml_cft}<span class='check'><Icon data={check} /></span>{/if}</td>
    <td>{#if row.consumer_protection}<span class='check'><Icon data={check} /></span>{/if}</td>
    <td>{#if row.licensing_disclosure}<span class='check'><Icon data={check} /></span>{/if}</td>
  </tr>
  {/each}
  </tbody>
</table>
</div>


<style>

    .table-wrapper {
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15);
        margin: 30px;
        max-height: 500px;
        overflow-y: scroll;
    }
    table {
        width: 100%;
        border-collapse: collapse;
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
        padding: 20px 25px;
    }

    thead th {
        border-top: 0;
    }
    tbody tr:last-child td {
        border-bottom: 0;
    }
    th:first-child, td:first-child {
        border-left: 0;
    }
    th:last-child, td:last-child {
        border-right: 0;
    }

    span.check {
        display: inline-block;
        background-color: #4BAE4F;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        color: white;
        padding: 4px 5px;
    }
    td:nth-of-type(n+3) {
        text-align: center;
    }


</style>