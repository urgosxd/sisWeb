import useSWR from "swr";
import { DocumentIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  Input,
  Textarea,
  Typography,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { createTour, deleteTour, getFicha, updateTour } from "../lib/api";
import { FileUploader } from "react-drag-drop-files";
import Loader from "./spinner";
import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  FilterFns,
  flexRender,
  RowData,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "./debounceInput";
import Filter from "./filter";
import useSkipper from "../hooks/skipper";

interface Props {
  permission: boolean;
}
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type TourType = {
  id: number;
  ciudad: string;
  excursion: string;
  provedor: string;
  ppp: string;
  pvp: string;
  fichasTecnicas: number[];
};

type TourJSONType = {
  [key: string]: string;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    // setData: {[key:string]:string}
    edits: boolean[];
    setEdites: React.Dispatch<React.SetStateAction<boolean[]>>;
    tempEditData: TourJSONType;
    uploadTime: boolean[];
    setUploadTime: React.Dispatch<React.SetStateAction<boolean[]>>;
    uploadTimeDel: boolean[];
    setUploadTimeDel: React.Dispatch<React.SetStateAction<boolean[]>>;
  }
}
// const aoeu =() => {
//       tableMeta?.setEdites((el) => el.map((ele, idx) => (idx == row.index ? !ele : false)))
//     }
const defaultColumn: Partial<ColumnDef<TourType>> = {
  cell: ({ getValue, row, column, table }) => {
    // When the input is blurred, we'll call our table meta's updateData function

    let initialValue = getValue() as string;
    // if(column.id == "ppp"){
    //   initialValue = row.original.ppp
    // }
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    const onBlur = () => {
      const idx = column.id;
      tableMeta!.tempEditData[idx] = value;
    };

    return tableMeta?.edits[row.index] ? (
      <td>
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      </td>
    ) : (
      <td>
        <div>{initialValue as string}</div>
      </td>
    );
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function RowTable({ permission }: Props) {
  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    "http://127.0.0.1:8000/apiCrud/tours/tour/",
    fetcher,
    { refreshInterval: 10 }
    // fetcher
  );

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };

  const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0;
    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
      dir = compareItems(
        rowA.columnFiltersMeta[columnId]?.itemRank!,
        rowB.columnFiltersMeta[columnId]?.itemRank!
      );
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [globalFilter, setGlobalFilter] = React.useState("");

 


  const [edits, setEdites] = useState(Array.from(data || [], (_) => false));

  const [uploadTime, setUploadTime] = useState(
    Array.from(data || [], (_) => false)
  );
  const [uploadTimeDel, setUploadTimeDel] = useState(
    Array.from(data || [], (_) => false)
  );
  const [createUpload, setCreateUpload] = useState(false);

  const fileTypes = ["PDF"];

  const [file, setFile] = useState<Array<File | undefined>>([]);

  const [isCreating, setIsCreating] = useState(false);
  // const [isDeleting,setIsDeleting] = useState(false)

  const handleChangeCreate = (index: number, newFile: File) => {
    const insertAt = index;
    const nextFile =
      file.length - 1 <= index
        ? file.concat(
            Array.from(Array(index - (file.length - 1)), () => undefined).map(
              (el, idx) => {
                if (idx == index - (file.length - 1) - 1) {
                  return newFile;
                } else {
                  return el;
                }
              }
            )
          )
        : [...file.slice(0, insertAt), newFile, ...file.slice(insertAt)];
    setFile(nextFile);
  };

  const myForm = useRef<HTMLFormElement | null>(null);

  function getDataFromFileName(path: string) {
    console.log(path);
    const pathSplit = path.split(".");
    console.log(pathSplit);
    const extension = pathSplit.slice(-1)[0];
    console.log(extension);
    const filename = pathSplit.slice(0, -1).join();
    return [filename, extension];
  }
  async function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  const createForm = async (e) => {
    e.preventDefault();
    setCreateUpload((prev) => true);
    console.log(file);
    if (file.includes(undefined)) {
      return;
    }

    // const preBlobs = await Promise.all(file!.map(ele=> ele.arrayBuffer()))

    // const blobs = preBlobs?.map((ele,idx)=> new Blob( [new Uint8Array(ele)],{type: file![idx].type }))

    // const blob = new Blob([new Uint8Array(preBlob)],{type: file!.type})

    const result = await Promise.all(file!.map(async (ele) => getBase64(ele!)));

    // const  [Filename,Extension] =  getDataFromFileName(file!.name)
    const res = [];
    for (let idx = 0; idx < result.length; idx++) {
      const [FileName, Extension] = getDataFromFileName(file![idx]!.name);
      res.push({
        FileName: FileName,
        Extension: Extension,
        Doc_Content: result[idx],
      });
    }

    let formData = new FormData();
    formData.append("ciudad", e.target.ciudad.value);
    formData.append("excursion", e.target.excursion.value);
    formData.append("provedor", e.target.provedor.value);
    formData.append("ppp", e.target.ppp.value);
    formData.append("pvp", e.target.pvp.value);
    formData.append("fichas", JSON.stringify(res));
    await createTour(formData);
  };
  useEffect(() => {
    setFile((prev) => []);
    setIsCreating((prev) => false);
    setCreateUpload((prev) => false);
    setUploadTime((prev) => Array.from(data || [],(_) => false))
    setUploadTimeDel((prev) => Array.from(data || [],(_) => false))
    setEdites((prev) => Array.from(data || [], (_) => false));
  }, [data]);

  async function getFichaTecnica(id: number) {
    const data = await getFicha(id);
    getFileDownload(data);
  }

  function getFileDownload(data: any) {
    const href = URL.createObjectURL(data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "file.pdf"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  const columns = React.useMemo<ColumnDef<TourType, any>[]>(
    () => [
      {
        header: "Tour",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.ciudad,
            id: "ciudad",
            header: () => <span>ciudad</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.excursion,
            id: "excursion",
            header: "excursion",
            footer: (props) => props.column.id,
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
          },
          {
            accessorFn: (row) => row.provedor,
            id: "provedor",
            // cell: (info) => info.getValue(),
            header: () => <span>provedor</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => Number(row.ppp),
            id: "ppp",
            // cell: (info) => info.getValue(),
            header: () => <span>ppp</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => Number(row.pvp),
            id: "pvp",
            // cell: (info) => info.getValue(),
            header: () => <span>pvp</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorkey: `ficha1`,
            id: "ficha1",
            cell: ({ getValue, row, column: { id }, table }) => {
              const tableMeta = table.options.meta;
              return tableMeta?.edits[row.index] ? (
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Popover>
                    <PopoverHandler>
                      <DocumentIcon className="w-5" />
                    </PopoverHandler>
                    <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0">
                      <FileUploader
                        handleChange={(ele: File) => handleChangeCreate(0, ele)}
                        name="file"
                        types={fileTypes}
                        label="Sube o arrastra un archivo justo aqui"
                      />
                      {file[0] && file[0].name}
                    </PopoverContent>
                  </Popover>
                </td>
              ) : (
                <td
                  className=""
                  onClick={async () =>
                    await getFichaTecnica(row.original.fichasTecnicas[0])
                  }
                >
                  <DocumentIcon className="w-5" />
                </td>
              );
            },

            header: () => <span>ficha1</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorkey: `ficha2`,
            id: "ficha2",
            cell: ({ getValue, row, column: { id }, table }) => {
              const tableMeta = table.options.meta;
              return tableMeta?.edits[row.index] ? (
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Popover>
                    <PopoverHandler>
                      <DocumentIcon className="w-5" />
                    </PopoverHandler>
                    <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0">
                      <FileUploader
                        handleChange={(ele: File) => handleChangeCreate(1, ele)}
                        name="file"
                        types={fileTypes}
                        label="Sube o arrastra un archivo justo aqui"
                      />
                      {file[1] && file[1].name}
                    </PopoverContent>
                  </Popover>
                </td>
              ) : (
                <td
                  className=""
                  onClick={async () =>
                    await getFichaTecnica(row.original.fichasTecnicas[1])
                  }
                >
                  <DocumentIcon className="w-5" />
                </td>
              );
            },

            header: () => <span>ficha2</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorkey: `action`,
            id: "action",
            cell: ({ getValue, row, column: { id }, table }) => {

              const Editable = () => {
                table.options.meta?.setEdites((el) =>
                  el.map((ele, idx) => (idx == row.index ? !ele : false))
                );
              };

              const Cancel = () => {
                table.options.meta?.setEdites((el) =>
                  el.map((ele, idx) => false)
                );
              };

              const Edit = async () => {
                table.options.meta?.setUploadTime((el) =>
                  el.map((ele, idx) => (idx == row.index ? true : false))
                );
                const formObj = table.options.meta?.tempEditData;
                if (file!.length > 0) {
                  const result = await Promise.all(
                    file!.map(async (ele) => getBase64(ele!))
                  );
                  const res = [];
                  for (let idx = 0; idx < result.length; idx++) {
                    const myFile = file?.[idx];
                    if (myFile) {
                      const [FileName, Extension] = getDataFromFileName(
                        myFile.name
                      );
                      res.push({
                        FileName: FileName,
                        Extension: Extension,
                        Doc_Content: result[idx],
                      });
                    } else {
                      res.push(undefined);
                    }
                  }
                  formObj!["fichas"] = JSON.stringify(res);
                }

                const ga = await updateTour(row.original.id, formObj);
                return;
              };
             

              const meta = table.options.meta;
              return (
                <div className="edit-cell-container">
                  {meta?.edits[row.index] ? (
                    <div className="edit-cell">
                      <button onClick={Cancel} name="cancel">
                        X
                      </button>
                      {meta.uploadTime[row.index] ? (
                        <Loader />
                      ) : (
                        <button onClick={Edit} name="done">
                          ✔
                        </button>
                      )}
                    </div>
                  ) : (
                    <td>
                      {permission ? (
                        <button onClick={Editable} name="edit">
                          ✐
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  )}
                </div>
              );
            },
            header: () => <span>action</span>,
          },
          {
            id: "delete",
            cell: ({ getValue, row, column: { id }, table }) => {
              const Delete = async () => {
                // console.log(TABLE_ROWS.length)
                table.options.meta?.setUploadTimeDel((el) =>
                  el.map((ele, idx) => (idx == row.index ? true : ele))
                );
                
                await deleteTour(row.original.id);
              };

              React.useEffect(() => {
                console.log(data.length)
                  table.options.meta?.setUploadTimeDel((el) =>
                  el.map((ele, idx) => (idx == row.index ? false : ele)).concat([false])
                );
              }, [data]);

              return (
                permission && (
                  <td>
                    {table.options.meta?.uploadTimeDel[row.index] ? (
                      <Loader />
                    ) : (
                      <TrashIcon className="w-5" onClick={Delete} />
                    )}
                  </td>
                )
              );
            },

            header: () => <span></span>,
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    meta: {
      edits,
      setEdites,
      tempEditData: {},
      uploadTime,
      setUploadTime,
      uploadTimeDel,
      setUploadTimeDel
    },
    defaultColumn,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
  });

  return (
    <div>
      <div>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
        />
      </div>
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            {isLoading
              ? "aoe"
              : table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : "",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: " 🔼",
                                  desc: " 🔽",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                              {header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              ) : null}
                            </>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
          </thead>
          <tbody>
            {<form id="CreateForm" onSubmit={createForm}></form>}
            {permission && isCreating && (
              <tr>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Input
                    type="text"
                    // value={ciudad}
                    defaultValue={""}
                    placeholder="ciudad"
                    name="ciudad"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Input
                    type="text"
                    // value={ciudad}
                    defaultValue={""}
                    placeholder="excursion"
                    name="excursion"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Input
                    type="text"
                    // value={ciudad}
                    defaultValue={""}
                    placeholder="proveedor"
                    name="provedor"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Input
                    type="text"
                    // value={ciudad}
                    defaultValue={""}
                    placeholder="ppp"
                    name="ppp"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </td>

                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Input
                    type="text"
                    // value={ciudad}
                    defaultValue={""}
                    placeholder="pvp"
                    name="pvp"
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-[100px]" }}
                  />
                </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Popover>
                    <PopoverHandler>
                      <DocumentIcon className="w-5" />
                    </PopoverHandler>
                    <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0">
                      <FileUploader
                        handleChange={(ele: File) => handleChangeCreate(0, ele)}
                        name="file"
                        types={fileTypes}
                        label="Sube o arrastra un archivo justo aqui"
                      />
                      {file[0] && file[0].name}
                    </PopoverContent>
                  </Popover>
                </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                  <Popover>
                    <PopoverHandler>
                      <DocumentIcon className="w-5" />
                    </PopoverHandler>
                    <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0">
                      <FileUploader
                        handleChange={(ele: File) => handleChangeCreate(1, ele)}
                        name="file"
                        types={fileTypes}
                        label="Sube o arrastra un archivo justo aqui"
                      />
                      {file[1] && file[1].name}
                    </PopoverContent>
                  </Popover>
                </td>

                <td className={"p-4 border-b border-blue-gray-50"}>
                  {createUpload ? (
                    <Loader />
                  ) : (
                    <Input
                      // type="text"
                      type="submit"
                      form="CreateForm"
                      value="Create"
                      // onClick={(e) => console.log(e)}
                      className="font-medium"
                    />
                  )}
                </td>
              </tr>
            )}
            {isLoading
              ? "aoe"
              : table.getRowModel().rows.map((row, index) => {
                  console.log(row);
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </Card>
      <button onClick={() => setIsCreating((prev) => !prev)}> ++</button>
    </div>
  );
}
export default RowTable;
