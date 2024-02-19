import { Column, Table } from "@tanstack/react-table"
import React from "react"
import DebouncedInput from "./debounceInput"
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline'
function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          // placeholder={`Min ${
          //   column.getFacetedMinMaxValues()?.[0]
          //     ? `(${column.getFacetedMinMaxValues()?.[0]})`
          //     : ''
          // }`}
          placeholder="Min"
          className="w-14 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          // placeholder={`Max ${
          //   column.getFacetedMinMaxValues()?.[1]
          //     ? `(${column.getFacetedMinMaxValues()?.[1]})`
          //     : ''
          // }`}
          placeholder="Max"
          className="w-14 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <div className="flex">
        <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Buscar... `}
        className="w-28 border shadow rounded"
        list={column.id + 'list'}
      />
    </div>
  )
}

export default Filter
