import React from "react"
import { Input } from "@material-tailwind/react";
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid'
import type { InputProps } from "@material-tailwind/react";

// A debounced input react componen
function DebouncedInput({
                          value: initialValue,
                          onChange,
                          debounce = 500,
                          ...props
                        }: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
      <div className="w-52 absolute z-20 top-10 bg-white rounded-lg  ">
        <Input
            variant={"outlined"}
            color={"red"}
            value={value}
            onChange={e => setValue(e.target.value)}
            labelProps={{
                className: "hidden",
            }}
            placeholder="Busqueda"

            // icon={<i className="fas fa-heart" />}
            icon={<MagnifyingGlassIcon />}
            className={"border-0"}
        />
      </div>
  )
  // return (
  //   <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  // )
}

export default DebouncedInput