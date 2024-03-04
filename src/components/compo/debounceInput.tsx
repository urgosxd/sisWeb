import React from "react"
import { Input } from "@material-tailwind/react";
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
      <div className="w-72 absolute top-10 bg-white rounded-lg">
        <Input
              value={value}
              onChange={e => setValue(e.target.value)}
              //className={'p-2 font-lg shadow rounded-lg w-1/5 h-14 absolute top-10'}
              label="Busqueda"
        />
      </div>
  )

  // return (
  //   <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  // )
}

export default DebouncedInput
