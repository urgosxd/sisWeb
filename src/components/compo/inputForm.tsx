import { Input } from "@material-tailwind/react";
import { SubmitHandler, useForm } from "react-hook-form";
interface Props {
  isEdit:boolean
  data:any,
  moreData:{id:number,index:number}
  setUploadTime:any
} 

type FormValues = {
  ciudad:string
  excursion:string
  provedor:string
  ppp:number
  pvp:number
}

interface ga {
  id:number
  index:number
}
function InputForm({isEdit,data,moreData,setUploadTime}:Props){
  const form = useForm<FormValues>({
    defaultValues:{
      ...data
    }
  }) 
  const  {register,control,handleSubmit,formState} = form
  const {errors} = formState

  
  const onSubmit = ({id,index}:ga) =>async (dataF)=>{
    
    setUploadTime(el => el.map((ele, idx) => idx == index ? true : false))
    let formData = new FormData(dataF)
    const newFormObject: { [key: string]: string } = {}

    formData.forEach((value, key) => {
      newFormObject[key] = value.toString()
    })
    
    console.log(formData)


  }

  return(
    <>
                  {<form id="subForm" onSubmit={handleSubmit(ele =>onSubmit(moreData))}></form>}
                  {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      <Input
                      type="text"
                      // value={ciudad}
                      form="subForm"
                      {...register("ciudad")}
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />

                      {/* {flexRender( */}
                      {/*   cell.column.columnDef.cell, */}
                      {/*   cell.getContext() */}
                      {/* )} */}
                    </td>
                  )
                })}

                  {child.<td className={""}>
                    <Input
                      type="text"
                      // value={ciudad}
                      form="subForm"
                      {...register("ciudad")}
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>}
    </>
 
  )
}

export default InputForm;
