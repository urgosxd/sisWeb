import { AuthWrapper, AuthData } from "../../provider/authProvider"
import { AuthProviderType } from "../../@types/authTypes"
import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";



export const Login = () => {
  const { user, login } = AuthData() as AuthProviderType
  //   if(user.isAuthenticated){
  //     const ga = useNavigate()
  //   ga("/")
  // }
  return (
    <div className="flex justify-center w-[100vw] h-[100vh] items-center">    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" className="">
          PDSVIAJES
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <form id="LOGINFORM" onSubmit={login}>
          {/* <Input label="Email" size="lg" /> */}
          {/* <Input label="Password" size="lg" /> */}
          <Input type="text" label="usuario" size="lg" name="username" placeholder="Enter Username" />
          <Input type="password" label="constrasenia" size="lg" name="password" placeholder="Enter Password" />

        </form>
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth type="submit" form="LOGINFORM">
          Ingresar
        </Button>
        <Typography variant="small" className="mt-6 flex justify-center">
          Sistema Operaciones y Ventas
          <Typography
            as="a"
            href="#signup"
            variant="small"
            color="blue-gray"
            className="ml-1 font-bold"
          >
          </Typography>
        </Typography>
      </CardFooter>
    </Card>
    </div>

  )
}



