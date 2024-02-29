import { Button, Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { flexRender } from "@tanstack/react-table";
import React from "react"

function PopOver({row,content})
{
  
  
  const [openPopover, setOpenPopover] = React.useState(false);
 
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };
 

  return (

<Popover open={openPopover} handler={setOpenPopover}>
<PopoverHandler {...triggers}>
                    <div key={row.id} className={`even:bg-blue-gray-50/50  table-row border-2 border-indigo-600`} >
                      {/* {row.original.currentUser && <span className="w-2 absolute">{row.original.currentUser}</span>} */}
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <div key={cell.id} className="table-cell p-4">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        );
                      })}

                    </div>
                    </PopoverHandler>
                        <PopoverContent {...triggers} className="z-50 max-w-[24rem]">
                          <Button
            variant="gradient"
            size="sm"
            className="font-medium capitalize"
          >
            {content}
          </Button>
                      </PopoverContent>
                  </Popover>


   )
}

export default PopOver
