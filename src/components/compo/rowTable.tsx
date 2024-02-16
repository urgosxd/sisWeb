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
import React, { useEffect, useRef, useState } from "react";
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
  flexRender,
  FilterFns,
} from "@tanstack/react-table";

import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "./debounceInput";
import Filter from "./filter";

interface Props {
  isCreating: boolean;
  TABLE_HEAD: string[];
  TABLE_ROWS: {
    id: number;
    ciudad: string;
    excursion: string;
    provedor: string;
    ppp: string;
    pvp: string;
    fichasTecnicas: number[];
  }[];
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function RowTable() {
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

  const TABLE_HEAD = [
    "Ciudad",
    "Excursion",
    "Proveedor",
    "ppp",
    "pvp",
    "pdf",
    "",
    "edit",
    "",
    "eliminar",
  ];

  const TABLE_ROWS: {
    id: number;
    ciudad: string;
    excursion: string;
    provedor: string;
    ppp: string;
    pvp: string;
    fichasTecnicas: number[];
  }[] = data ? data : [];

  const columns = React.useMemo<ColumnDef<TourType, any>[]>(
    () => [
      {
        header: "Tour",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorFn: (row) => row.ciudad,
            id: "ciudad",
            cell: (info) => info.getValue(),
            header: () => <span>ciudad</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.excursion,
            id: "excursion",
            header: "excursion",
            cell: (info) => info.getValue(),
            footer: (props) => props.column.id,
            filterFn: "fuzzy",
            sortingFn: fuzzySort,
          },
          {
            accessorFn: (row) => row.provedor,
            id: "provedor",
            cell: (info) => info.getValue(),
            header: () => <span>provedor</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => Number(row.ppp),
            id: "ppp",
            cell: (info) => info.getValue(),
            header: () => <span>ppp</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );

  // const initialState = { CoLU: ['id'] };

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
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: false,
  });

  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const [edits, setEdites] = useState(Array.from(TABLE_ROWS, (_) => false));
  const [uploadTime, setUploadTime] = useState(
    Array.from(TABLE_ROWS, (_) => false)
  );
  const [createUpload, setCreateUpload] = useState(false);

  const fileTypes = ["PDF"];

  const editChangeById = (id: number) => {
    setEdites((el) => el.map((ele, idx) => (idx == id ? !ele : false)));
  };

  const [file, setFile] = useState<Array<File | undefined>>([]);

  const [isCreating, setIsCreating] = useState(false);
  // const [isDeleting,setIsDeleting] = useState(false)

  const handleDelete = async (id: number, idxx: number) => {
    setUploadTime((el) => el.map((ele, idx) => (idx == idxx ? true : false)));
    await deleteForm(id);
  };
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

  const handleChangeUpdate = (index: number, newFile: File) => {
    const empty: Array<File | undefined> = [];
    empty[index] = newFile;
    setFile((el) =>
      el.length > index
        ? el!.map((ele, idx) => {
            if (idx == index) {
              return newFile;
            } else {
              return ele;
            }
          })
        : empty
    );
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
    // setIsCreating(prev=>false)
  };

  useEffect(() => {
    setFile((prev) => []);
    setIsCreating((prev) => false);
    setCreateUpload((prev) => false);
    setUploadTime((prev) => Array.from(TABLE_ROWS, (_) => false));
    setEdites((prev) => Array.from(TABLE_ROWS, (_) => false));
  }, [data]);

  console.log(file);

  const updateForm = async (id: number, e, index: number) => {
    e.preventDefault();

    setUploadTime((el) => el.map((ele, idx) => (idx == index ? true : false)));
    let formData = new FormData(myForm.current!);
    const newFormObject: { [key: string]: string } = {};

    formData.forEach((value, key) => {
      newFormObject[key] = value.toString();
    });

    if (file!.length > 0) {
      const result = await Promise.all(
        file!.map(async (ele) => getBase64(ele!))
      );
      const res = [];
      for (let idx = 0; idx < result.length; idx++) {
        const myFile = file?.[idx];
        if (myFile) {
          const [FileName, Extension] = getDataFromFileName(myFile.name);
          res.push({
            FileName: FileName,
            Extension: Extension,
            Doc_Content: result[idx],
          });
        } else {
          res.push(undefined);
        }
      }
      newFormObject["fichas"] = JSON.stringify(res);
    }

    await updateTour(id, newFormObject);
  };

  const deleteForm = async (id: number) => {
    await deleteTour(id);
  };

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
            {/* <tr> */}
            {/*   {TABLE_HEAD.map((head) => ( */}
            {/*     <th */}
            {/*       key={head} */}
            {/*       className="border-b border-blue-gray-100 bg-blue-gray-50 p-4" */}
            {/*     > */}
            {/*       <Typography */}
            {/*         variant="small" */}
            {/*         color="blue-gray" */}
            {/*         className="font-normal leading-none opacity-70" */}
            {/*       > */}
            {/*         {head} */}
            {/*       </Typography> */}
            {/*     </th> */}
            {/*   )) */}
            {/* } */}
            {/* </tr> */}

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
            {isCreating && (
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
            {/* {isLoading ? "loaddd" :  TABLE_ROWS.map(({ id, ciudad, excursion, provedor, ppp, pvp, fichasTecnicas }, index) => { */}
            {/*   const isLast = index === TABLE_ROWS.length - 1; */}
            {/*   const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50"; */}
            {/*   return edits[index] ? */}

            {/*     <tr key={id}> */}
            {/*       {<form ref={myForm} id="subForm" onSubmit={el => updateForm(id, el,index)}></form>} */}
            {/*       <td className={classes}> */}
            {/*         <Input */}
            {/*           type="text" */}
            {/*           // value={ciudad} */}
            {/*           defaultValue={ciudad} */}
            {/*           name="ciudad" */}
            {/*           form="subForm" */}
            {/*           placeholder="ciudad" */}
            {/*           className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*           labelProps={{ */}
            {/*             className: "hidden", */}
            {/*           }} */}
            {/*           containerProps={{ className: "min-w-[100px]" }} */}
            {/*         /> */}
            {/*       </td> */}
            {/*       <td className={classes}> */}
            {/*         <Input */}
            {/*           type="text" */}
            {/*           // value={ciudad} */}
            {/*           defaultValue={excursion} */}
            {/*           name="excursion" */}
            {/*           form="subForm" */}
            {/*           placeholder="excursion" */}
            {/*           className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*           labelProps={{ */}
            {/*             className: "hidden", */}
            {/*           }} */}
            {/*           containerProps={{ className: "min-w-[100px]" }} */}
            {/*         /> */}
            {/*       </td> */}
            {/*       <td className={classes}> */}
            {/*         <Input */}
            {/*           type="text" */}
            {/*           // value={ciudad} */}
            {/*           defaultValue={provedor} */}
            {/*           placeholder="proveedor" */}
            {/*           className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*           labelProps={{ */}
            {/*             className: "hidden", */}
            {/*           }} */}
            {/*           containerProps={{ className: "min-w-[100px]" }} */}
            {/*         /> */}
            {/*       </td> */}
            {/*       <td className={classes}> */}
            {/*         <Input */}
            {/*           type="text" */}
            {/*           // value={ciudad} */}
            {/*           defaultValue={ppp} */}
            {/*           name="ppp" */}
            {/*           form="subForm" */}
            {/*           placeholder="ppp" */}
            {/*           className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*           labelProps={{ */}
            {/*             className: "hidden", */}
            {/*           }} */}
            {/*           containerProps={{ className: "min-w-[100px]" }} */}
            {/*         /> */}
            {/*       </td> */}

            {/*       <td className={classes}> */}
            {/*         <Input */}
            {/*           type="text" */}
            {/*           // value={ciudad} */}
            {/*           defaultValue={pvp} */}
            {/*           name="pvp" */}
            {/*           form="subForm" */}
            {/*           placeholder="pvp" */}
            {/*           className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*           labelProps={{ */}
            {/*             className: "hidden", */}
            {/*           }} */}
            {/*           containerProps={{ className: "min-w-[100px]" }} */}
            {/*         /> */}
            {/*       </td> */}
            {/*       <td className={classes}> */}
            {/*         <Popover> */}
            {/*           <PopoverHandler> */}
            {/*             <DocumentIcon className="w-5" /> */}
            {/*           </PopoverHandler> */}
            {/*           <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0"> */}

            {/*             <FileUploader handleChange={(e: File) => handleChangeCreate(0, e)} name="file" types={fileTypes} label="Sube o arrastra un archivo justo aqui" /> */}
            {/*             {file[0] && file[0].name} */}
            {/*           </PopoverContent> */}
            {/*         </Popover> */}
            {/*       </td> */}
            {/*       <td className={classes}> */}
            {/*         <Popover> */}
            {/*           <PopoverHandler> */}
            {/*             <DocumentIcon className="w-5" /> */}
            {/*           </PopoverHandler> */}
            {/*           <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0"> */}

            {/*             <FileUploader handleChange={(e: File) => handleChangeCreate(1, e)} name="file" types={fileTypes} label="Sube o arrastra un archivo justo aqui" /> */}

            {/*             {file[1] && file[1].name} */}
            {/*           </PopoverContent> */}
            {/*         </Popover> */}
            {/*       </td> */}

            {/*       <td className=""> */}
            {/*         { uploadTime[index] ? <Loader/> : */}
            {/*         <Input */}
            {/*           type="submit" */}
            {/*           color="blue-gray" */}
            {/*           form="subForm" */}
            {/*           className="font-medium" */}
            {/*           value="Editar" */}
            {/*         /> */}

            {/*       } */}
            {/*       </td> */}
            {/*          */}
            {/*     </tr> */}
            {/*     : <tr key={ciudad}> */}
            {/*       <td className={classes} onClick={() => editChangeById(index)}> */}
            {/*         <Typography */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           className="font-normal w-[200px] px-[13px] py-[11px]" */}
            {/*         > */}
            {/*           {ciudad} */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*       <td className={classes} onClick={() => editChangeById(index)}> */}
            {/*         <Typography */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           className="font-normal w-[200px] px-[13px] py-[11px]" */}
            {/*         > */}
            {/*           {excursion} */}
            {/*         </Typography> */}
            {/*       </td> */}

            {/*       <td className={classes} onClick={() => editChangeById(index)}> */}
            {/*         <Typography */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           className="font-normal w-[200px] px-[13px] py-[11px]" */}
            {/*         > */}
            {/*           {provedor} */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*       <td className={classes} onClick={() => editChangeById(index)}> */}
            {/*         <Typography */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           className="font-normal w-[200px] px-[13px] py-[11px]" */}
            {/*         > */}
            {/*           {ppp} */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*       <td className={classes} onClick={() => editChangeById(index)}> */}
            {/*         <Typography */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           className="font-normal w-[200px] px-[13px] py-[11px]" */}
            {/*         > */}
            {/*           {pvp} */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*       <td className={classes} onClick={async () =>await getFichaTecnica(fichasTecnicas[0])}> */}
            {/*             <DocumentIcon className="w-5" /> */}
            {/*       </td> */}

            {/*       <td className={classes} onClick={async () => await  getFichaTecnica(fichasTecnicas[1])}> */}
            {/*             <DocumentIcon className="w-5" /> */}
            {/*       </td> */}

            {/*       <td className={classes}> */}
            {/*         <Typography */}
            {/*           as="a" */}
            {/*           href="#" */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           onClick={() => editChangeById(index)} */}
            {/*           className="font-medium " */}
            {/*         > */}
            {/*            */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*        <td className={classes}> */}
            {/*         <Typography */}
            {/*           as="a" */}
            {/*           href="#" */}
            {/*           variant="small" */}
            {/*           color="blue-gray" */}
            {/*           onClick={() => editChangeById(index)} */}
            {/*           className="font-medium " */}
            {/*         > */}
            {/*         </Typography> */}
            {/*       </td> */}
            {/*         <td className={classes}> */}
            {/*          {uploadTime[index] ? <Loader/> : <TrashIcon className="w-5" onClick={()=>handleDelete(id,index)} />} */}
            {/*     */}
            {/*        */}
            {/*       </td> */}
            {/*     </tr> */}
            {/* })} */}

            {isLoading
              ? "aoe"
              : table.getRowModel().rows.map((row, index) => {
                  console.log(row);
                  return edits[index] ? (
                    <tr key={row.id}>
                      {
                        <form
                          ref={myForm}
                          id="subForm"
                          onSubmit={(el) =>
                            updateForm(row.original.id, el, index)
                          }
                        ></form>
                      }
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                          <Input 

            type="text" 
                      // value={ciudad}
                      // defaultValue={flexRender(
                      //         cell.column.columnDef.cell,
                      //         cell.getContext()
                      //       )}
                      name="ppp"
                      form="subForm"
                      placeholder="ppp"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                            />

                            {}
                          </td>
                        );
                      })}
                    </tr>
                  ) : (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td key={cell.id}>
                            <Typography
                              as="a"
                              href="#"
                              variant="small"
                              color="blue-gray"
                              onClick={() => editChangeById(index)}
                              className="font-medium "
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Typography>
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
