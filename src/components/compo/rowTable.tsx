import useSWR from "swr";
import { Card, Input, Textarea, Typography } from "@material-tailwind/react";
import { useState } from "react";

interface Props {
  TABLE_HEAD: string[]
  TABLE_ROWS: {
    ciudad: string
    excursion: string
    provedor: string
    ppp: string
    pvp: string
  }[]
}

function RowTable({ TABLE_HEAD, TABLE_ROWS }: Props) {


  const [edits, setEdites] = useState(Array.from(TABLE_ROWS, (_) => false))

  const editChangeById = (id:number)=>{
    setEdites(el => el.map((ele,idx)=> idx == id ? !ele : ele ))
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
            {TABLE_ROWS.map(({ ciudad, excursion, provedor, ppp, pvp }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return edits[index] ?
                <tr key={ciudad}>
                  <td className={classes}>
                    <Input
                      type="text"
                      // value={ciudad}
                      defaultValue={ciudad}
                      placeholder={ciudad}
                      className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
                      labelProps={{
                        className: "hidden",
                      }}
                      containerProps={{ className: "min-w-[100px]" }}
                    />
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {excursion}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {provedor}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ppp}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {pvp}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      onClick={()=>editChangeById(index)}
                      className="font-medium"
                    >
                      Edit
                    </Typography>
                  </td>
                </tr>
                : <tr key={ciudad}>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ciudad}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {excursion}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {provedor}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {ppp}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {pvp}
                    </Typography>
                  </td>

                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      onClick={()=>editChangeById(index)}
                      className="font-medium"
                    >
                      Edit
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
