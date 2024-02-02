import useSWR from "swr";
import { DocumentIcon } from '@heroicons/react/24/outline'
import {
  Button, Card, Input, Textarea, Typography, Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { useState } from "react";
import { createTour } from "../lib/api";
import { FileUploader } from "react-drag-drop-files";

interface Props {
  isCreating: boolean
  TABLE_HEAD: string[]
  TABLE_ROWS: {
    id: number
    ciudad: string
    excursion: string
    provedor: string
    ppp: string
    pvp: string
    fichasTecnicas: number[]
  }[]
}


function RowTable({ TABLE_HEAD, TABLE_ROWS, isCreating }: Props) {


  const [edits, setEdites] = useState(Array.from(TABLE_ROWS, (_) => false))

  const fileTypes = ["PDF"];

  const editChangeById = (id: number) => {
    setEdites(el => el.map((ele, idx) => idx == id ? !ele : false))
  }
  const [file, setFile] = useState<File 
    |null>(null);
  const handleChange = (file:File) => {
    setFile(file);
  };

  function getDataFromFileName(path:string){
    console.log(path);
    
    const pathSplit = path.split(".")
    console.log(pathSplit)
    const extension = pathSplit.slice(-1)[0]
    console.log(extension)
    const filename = pathSplit.slice(0,-1).join()
    
    return [filename,extension]
  }
async function getBase64(file:File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = reject
  })
}
  const createForm = async (e) => {
    e.preventDefault()
    console.log(file)
    const preBlob = await file!.arrayBuffer()
    
    const blob = new Blob([new Uint8Array(preBlob)],{type: file!.type})

    const result = await getBase64(file!)
      
    const  [Filename,Extension] =  getDataFromFileName(file!.name)

    let formData = new FormData();
      formData.append("ciudad",e.target.ciudad.value)
      formData.append("excursion",e.target.excursion.value)
      formData.append("provedor",e.target.provedor.value)
      formData.append("ppp",e.target.ppp.value)
      formData.append("pvp",e.target.pvp.value)
      // formData.append("blobs",blob)
      formData.append("fichas",JSON.stringify([{FileName:Filename,Extension:Extension,Doc_Content:result}]))

    console.log(Extension)
    await createTour(formData)

  }

  return (
    <div>
      {/* {JSON.stringify(data)} */}
      <Card className="h-full w-full overflow-scroll">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {<form id="CreateForm" onSubmit={createForm}></form>}
            {isCreating && <tr>

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
                  name="pvp"
                  containerProps={{ className: "min-w-[100px]" }}
                />
              </td>
                <td className={"p-4 border-b border-blue-gray-50"}>
                    <Popover>
                      <PopoverHandler>
                        <DocumentIcon className="w-5" />
                      </PopoverHandler>
                      <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0" >
                        <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="Sube o arrastra un archivo justo aqui" />
                      </PopoverContent>
                    </Popover>
                  </td>


              <td className={"p-4 border-b border-blue-gray-50"}>
                <Input
                  // type="text"
                  type="submit"
                  form="CreateForm"
                  value="Create"
                  // onClick={(e) => console.log(e)}
                  className="font-medium"
                />
              </td>


            </tr>}
            {TABLE_ROWS.map(({ id, ciudad, excursion, provedor, ppp, pvp, fichasTecnicas }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return edits[index] ?
                <tr key={ciudad}>
                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={ciudad}
                      placeholder="ciudad"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>
                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={excursion}
                      placeholder="excursion"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>
                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={provedor}
                      placeholder="proveedor"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>
                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={ppp}
                      placeholder="ppp"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>

                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={pvp}
                      placeholder="pvp"
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>
                  <td className={classes}>
                    <Popover>
                      <PopoverHandler>
                        <DocumentIcon className="w-5" />
                      </PopoverHandler>
                      <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0">

                        <FileUploader handleChange={handleChange} name="file" types={fileTypes} label="Sube o arrastra un archivo justo aqui" />
                        
                        </PopoverContent>
                    </Popover>
                  </td>
                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      onClick={() => editChangeById(index)}
                      className="font-medium"
                    >
                    Editar
                    </Typography>
                  </td>
                </tr>
                : <tr key={ciudad}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-[200px] px-[13px] py-[11px]"
                    >
                      {ciudad}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-[200px] px-[13px] py-[11px]"
                    >
                      {excursion}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-[200px] px-[13px] py-[11px]"
                    >
                      {provedor}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-[200px] px-[13px] py-[11px]"
                    >
                      {ppp}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-[200px] px-[13px] py-[11px]"
                    >
                      {pvp}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Popover>
                      <PopoverHandler>
                        <DocumentIcon className="w-5" />
                      </PopoverHandler>
                      <PopoverContent className="z-[999] grid w-[28rem] grid-cols-2 overflow-hidden p-0" >

                      </PopoverContent>
                    </Popover>
                  </td>


                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      onClick={() => editChangeById(index)}
                      className="font-medium "
                    >
                      {}
                    </Typography>
                  </td>
                </tr>
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
export default RowTable
