import useSWR from "swr";
import { DocumentIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createTour, deleteTour, getFicha, updateTour } from "../lib/api";
import {
  Button,
  Card,
  Input,
  Textarea,
  Typography,
  Popover,
  PopoverHandler,
  PopoverContent,
  IconButton,
} from "@material-tailwind/react";
import NotificationToast from "../compo/notification";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
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
import 'react-toastify/dist/ReactToastify.css';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import DebouncedInput from "./debounceInput";
import Filter from "./filter";
import useSkipper from "../hooks/skipper";
import HeaderTable from "./headerTable";

interface Props {
  permission: boolean;
  url: string
  baseColumns: { name: string, extra: string }[]
  methods: {
    create: any
    update: any
    delete: any
  }
}

import { ToastContainer, toast } from 'react-toastify';
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}



// type TourType = {
//   id: number;
//   ciudad: string;
//   excursion: string;
//   provedor: string;
//   ppp: string;
//   ppe: string;
//   pvp: string;
//   pve: string;
//   figma: string;
//   fichasTecnicas: number[];
// };

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
const defaultColumn: Partial<ColumnDef<any>> = {
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
      <div className="w-40">
        <Input
          type={typeof initialValue === 'number' ? "number" : "text"}
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          containerProps={{
            className: "!min-w-0 !w-fit ",
          }}
        />
      </div>
    ) : (
      <div className="!w-fit">{typeof initialValue === "number" ? (initialValue as number).toFixed(2) : initialValue}</div>
    );
  },
};


const special = ["figma", "pdf"]



const fetcher = (url: string) => fetch(url).then((res) => res.json());

function RowTable({ permission, url, baseColumns, methods }: Props) {

  // function gaa(baseColumns:any){
  //  const names = baseColumns.map(ele=>ele.name)
  //  const values = ["","",jk]
  // }

  const notify = (message: string) => toast(message);
  const { data, error, isLoading } = useSWR(
    // "https://siswebbackend.pdsviajes.com/apiCrud/tours/tour",
    url,
    fetcher,
    { refreshInterval: 10 }
    // fetcher
  );


  const [ErrFecth, setErrFetch] = useState(false)
  console.log(data || 0)
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



  const compSpecial = {
    "figma": {
      accessorFn: (row) => (row.figma),
      id: "figma",
      cell: ({ getValue, row, column, table }) => {
        let initialValue = getValue() as string;
        // if(column.id == "ppp"){
        //   initialValue = row.original.ppp
        // }
        // const columnMeta = column.columnDef.meta;
        const tableMeta = table.options.meta;
        const [value, setValue] = React.useState(initialValue);
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);
        const onBlur = () => {
          const idx = column.id;
          tableMeta!.tempEditData[idx] = value;
        };

        return tableMeta?.edits[row.index] ? (
          <div className="w-36">

            <Input
              // type={typeof initialValue === 'number' ? "number" : "text"}
              type="text"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
              containerProps={{
                className: "!min-w-0",
              }}
            />
          </div>
        ) : (
          <div
            className="w-36"
          >
            <a href={initialValue as string} target="_blank"> Link</a>
          </div>
        );

      }
    },
    "pdf":
    {
      accessorkey: `pdf`,
      id: "drive",
      cell: ({ getValue, row, column, table }) => {
        let initialValue = getValue() as string;
        const tableMeta = table.options.meta;
        const [value, setValue] = React.useState(initialValue);
        React.useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);
        const onBlur = () => {
          const idx = column.id;
          tableMeta!.tempEditData[idx] = value;
        };


        return tableMeta?.edits[row.index] ? (
          <div className="w-36">

            <Input
              // type={typeof initialValue === 'number' ? "number" : "text"}
              type="text"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              onBlur={onBlur}
              containerProps={{
                className: "!min-w-0",
              }}
            />
          </div>
        ) : (
          <div
            className="w-36"
          >
            <a href={initialValue as string} target="_blank"> Link Drive</a>
          </div>
        );
      },

      header: () => <span>pdf</span>,
      footer: (props) => props.column.id,
    },
  }

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

  useEffect(() => {

    if (!ErrFecth) {
      return
    }
    notify("Error")
  }, [ErrFecth])
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
    const res: any[] = [];
    for (let idx = 0; idx < result.length; idx++) {
      const [FileName, Extension] = getDataFromFileName(file![idx]!.name);
      res.push({
        FileName: FileName,
        Extension: Extension,
        Doc_Content: result[idx],
      });
    }
    console.log(e);

    let formData = new FormData();
    baseColumns.forEach(element => {
      if (element.name == "pdf") {
        // formData.append("fichas", JSON.stringify(res));
        formData.append("drive", e.target["drive"].value);
      } else {
        formData.append(element.name, e.target[element.name].value);
      }
    });

    // console.log(e.target["drive"].value)
    formData.append("fichas", JSON.stringify(res));
    try {

      const respuesta = await methods.create(formData);
      if (respuesta) {
        setIsCreating(prev => false)
        setCreateUpload((prev) => false);
      }

    } catch (error) {
      setCreateUpload((prev) => false);
      setErrFetch(prev => true)
    }
  };
function replaceArray(originalArray:boolean[], newArray:boolean[]) {
    // Calculate the difference in length between the original and new array
    //
    if (newArray.length == 0){
      return originalArray
    }
    const lengthDifference = originalArray.length - newArray.length;

    // If the original array is longer than the new array, remove elements from the original array
    if (lengthDifference > 0) {
        originalArray.splice(newArray.length, lengthDifference);
    }
    // If the new array is longer than the original array, append undefined elements to the original array
    else if (lengthDifference < 0) {
        originalArray.splice(originalArray.length, 0, ...Array(Math.abs(lengthDifference)).fill(undefined));
    }

    // Replace the contents of the original array with the contents of the new array
    originalArray.splice(0, newArray.length, ...newArray);
    return originalArray
}

  useEffect(() => {
    setFile((prev) => []);
    // setIsCreating((prev) => false);
    // setUploadTime((prev) => Array.from(data || [], (_) => false))
    // setEdites((prev) => Array.from(data || [], (_) => false))
    setEdites((prev)=>  replaceArray(Array.from(data || [], (_) => false),prev))
    setUploadTimeDel((prev)=>replaceArray(Array.from(data || [], (_) => false),prev))
    setErrFetch(prev => false)
  }, [data, ErrFecth]);

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
  function toCurrency(numberString: string) {
    let number = parseFloat(numberString);
    return number.toLocaleString('USD');
  }

  const auxiliare = [{
    accessorkey: `action`,
    id: "action",
    cell: ({ getValue, row, column: { id }, table }) => {

      const Editable = () => {
        table.options.meta?.setEdites((el) =>
          el.map((ele, idx) => (idx == row.index ? true : false))
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

        // table.options.meta?.setEdites((el) =>
        //   el.map((ele, idx) => (idx == row.index ? true : false))
// )
    //     useEffect(()=>{
    // table.options.meta?.setEdites((el) =>
    //       el.map((ele, idx) => (idx == row.index ? true : false))
    //       )
    //     },[])
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
        try {
          const respuesta = await methods.update(row.original.id, formObj);
          setUploadTime((prev) => Array.from(data || [], (_) => false))
          setEdites((prev) => Array.from(data || [], (_) => false));
        } catch (error) {
          setErrFetch(prev => true)
          setEdites((prev) => Array.from(data || [], (_) => false));
        }
        return;
      };


      const meta = table.options.meta;
      return (
        meta?.edits[row.index] ? (
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
          <div>
            {permission ? (
              <button onClick={Editable} name="edit">
                ✐
              </button>
            ) : (
              <div></div>
            )}
          </div>
        )
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

        try {

          await methods.delete(row.original.id);
          setUploadTimeDel((ele) => ele.map((ele, idx) => (idx == row.index ? false : ele)))
        } catch (error) {
          console.log(error)
          setErrFetch(prev => true)
          setUploadTimeDel((ele) => ele.map((ele, idx) => (idx == row.index ? false : ele)))
        }
      };

      // React.useEffect(() => {
      //   table.options.meta?.setUploadTimeDel((el) =>
      //     el.map((ele, idx) => (idx == row.index ? false : ele)).concat([false])
      //   );
      //   setUploadTimeDel((prev)=>replaceArray(Array.from(data || [], (_) => false),prev))
      // }, [data]);

      return (
        permission &&
          table.options.meta?.uploadTimeDel[row.index] ? (
          <Loader />
        ) : (
          <TrashIcon className="w-5" onClick={Delete} />
        )

      );
    },

    header: () => <span></span>,
  },]

  const currenci: { [key: string]: string } = { "sol": "PEN", "dolar": "USD" }



  const gaa = baseColumns.map(ele => {
    if (special.includes(ele.name)) {
      return compSpecial[ele.name]
    } else {
      let ga = null
      let type = ""
      switch (ele.extra) {
        case "none":
          ga = (row) => row[ele.name]
          type = "string"
          break;
        case "time":
          ga = (row) => row[ele.name]
          type = "string"
          break
        case "large":
          ga = (row) => row[ele.name]
          type = "string"
          break
        case "tel":
          ga = (row) => row[ele.name]
          type = "string"
          break
        default:
          ga = (row) => Number(row[ele.name])
          type = "number"
          break;
      }
      return ({
        accessorFn: ga,
        // accessorFn: (row)=>console.log([`${ele.name}`]),
        id: ele.name,
        header: `${ele.name[0].toUpperCase() + ele.name.slice(1)} ${ele.extra == "none" ? "" : currenci[ele.extra]} `,
        meta: {
          type: type
        },
        footer: (props) => props.column.id
      })
    }
  }
  ).concat(auxiliare)
  const columns = React.useMemo<ColumnDef<any, any>[]>(
    () =>
      gaa
    , []
  )

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
    // debugTable: true,
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
                      <th key={header.id} colSpan={header.colSpan} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        {header.isPlaceholder ? null : (
                          <HeaderTable header={header} table={table} >
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
                          </HeaderTable>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
          </thead>
          <tbody>
            {<form id="CreateForm" onSubmit={createForm}></form>}
            <tr>
              {(permission && isCreating) && baseColumns.map((ele) => {
                // const firstValue = table
                //   .getPreFilteredRowModel()
                //   .flatRows[0]?.getValue(header.column.id)
                //
                if (ele.name == "figma") {
                  return (
                    <td><Input
                      type="text"
                      defaultValue={""}
                      placeholder={ele.name as string}
                      name={ele.name as string}
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      form="CreateForm"
                      containerProps={{ className: "min-w-36 !w-36" }}
                    /></td>)
                }
                else if (ele.name == "pdf") {
                  return (
                    <td><Input
                      type="text"
                      defaultValue={""}
                      placeholder={ele.name as string}
                      name="drive"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      form="CreateForm"
                      containerProps={{ className: "min-w-36 !w-36" }}

                    /></td>
                  )
                }
                return !special.includes(ele.name as string) &&
                  <td><Input
                    type={ele.type}
                    step="any"
                    defaultValue={""}
                    placeholder={ele.name as string}
                    name={ele.name as string}
                    className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                    labelProps={{
                      className: "hidden",
                    }}
                    form="CreateForm"
                    containerProps={{ className: "min-w-36 !w-36" }}
                  /></td>
              })}
              {permission && isCreating &&
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

              }
            </tr>
            {/* { permission && isCreating && ( */}
            {/*   <tr> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="text" */}
            {/*         // value={ciudad} */}
            {/*         defaultValue={""} */}
            {/*         placeholder="ciudad" */}
            {/*         name="ciudad" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="text" */}
            {/*         // value={ciudad} */}
            {/*         defaultValue={""} */}
            {/*         placeholder="excursion" */}
            {/*         name="excursion" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="text" */}
            {/*         // value={ciudad} */}
            {/*         defaultValue={""} */}
            {/*         placeholder="proveedor" */}
            {/*         name="provedor" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="number" */}
            {/*         // value={ciudad} */}
            {/*         defaultValue={""} */}
            {/*         placeholder="ppp" */}
            {/*         name="ppp" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="number" */}
            {/*         // value={ciudad} */}
            {/*         // disabled */}
            {/*         placeholder="ppe" */}
            {/*         name="ppe" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}


            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="number" */}
            {/*         // value={ciudad} */}
            {/*         defaultValue={""} */}
            {/*         placeholder="pvp" */}
            {/*         name="pvp" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}
            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Input */}
            {/*         type="number" */}
            {/*         // value={ciudad} */}
            {/*         // disabled */}
            {/*         placeholder="pve" */}
            {/*         name="pve" */}
            {/*         className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10" */}
            {/*         labelProps={{ */}
            {/*           className: "hidden", */}
            {/*         }} */}
            {/*         form="CreateForm" */}
            {/*         containerProps={{ className: "min-w-[100px]" }} */}
            {/*       /> */}
            {/*     </td> */}


            {/*     <td className={"p-4 border-b border-blue-gray-50"}> */}
            {/*       <Popover> */}
            {/*         <PopoverHandler> */}
            {/*           <DocumentIcon className="w-5" /> */}
            {/*         </PopoverHandler> */}
            {/*         <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0"> */}
            {/*           <FileUploader */}
            {/*             handleChange={(ele: File) => handleChangeCreate(1, ele)} */}
            {/*             name="file" */}
            {/*             types={fileTypes} */}
            {/*             label="Sube o arrastra un archivo justo aqui" */}
            {/*           /> */}
            {/*           {file[1] && file[1].name} */}
            {/*         </PopoverContent> */}
            {/*       </Popover> */}
            {/*     </td> */}

            {isLoading
              ? <Loader />
              : table.getRowModel().rows.map((row, index) => {
                console.log(row);
                return (
                  <tr key={row.id} className="even:bg-blue-gray-50/50">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="p-4">
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
        {data &&
          <div className="mx-auto" >
            <div className="flex items-center gap-2">
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
              <span className="flex items-center gap-1">
                <div>Pagina</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} de {' '}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Ir a la Pagina:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
          </div>
        }
      </Card>
      <button className="fixed bottom-8 right-5 rounded-full w-28 flex justify-center items-center  h-28 border border-blue-gray-400" onClick={() => setIsCreating((prev) => !prev)}>
        <PlusIcon color="red" className="w-20" />
      </button>

      <ToastContainer />
    </div>
  );
}
export default RowTable;
