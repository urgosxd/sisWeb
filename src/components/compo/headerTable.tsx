import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Header, Table } from '@tanstack/react-table'
import React from 'react'
import Filter from './filter';

type TourType = {
  id: number;
  ciudad: string;
  excursion: string;
  provedor: string;
  ppp: string;
  pvp: string;
  fichasTecnicas: number[];
}
export default function HeaderTable({ children, header, table }: { children: React.ReactNode, header: Header<TourType, unknown>, table: Table<TourType> }) {

  const [isOpen, setIsOpen] = React.useState(false)
  const noHeader =  header.column.columnDef.header?.length! > 0 
  return (
    <div className="h-10">

        <div className={`flex ${noHeader ?"w-36":"w-12"}`}>
      {children}

        {

   noHeader && <MagnifyingGlassIcon className="w-5" onClick={() => setIsOpen(prev => !prev)} />
      }
      </div>

      {header.column.getCanFilter() ? (
        <div>
          {
            isOpen &&
            <Filter
              // noHeader={header.column.columnDef.header?.length! > 0}
              column={header.column}
              table={table}
            />
          }
        </div>
      ) : null}

    </div>

  )
}
