const ERROR_MSG = "Oops! Something went wrong";

const BASE = `${import.meta.env.VITE_URL_BACK}/`

export interface FetchData {
  url: string;
  options?: RequestInit;
}

const fetchData = async function({ url, options }: FetchData): Promise<any> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(ERROR_MSG);
  }

  const data = await response.json();
  return data;
};

const fetchFile = async function({ url, options }: FetchData): Promise<any> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(ERROR_MSG);
  }

  const data = await response.blob();
  return data;
};
// const BASE_URL = "https://siswebbackend.pdsviajes.com/apiCrud/tours/"
const BASE_URL = BASE + "apiCrud/tours/"
const BASE_FICHA_URL = BASE + "apiCrud/fichaTecnica/"
export async function createTour(tour: any) {
  console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URL + "tour/", options })
}

export async function updateTour(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URL + `tour/${id}/`, options })
}

export async function deleteTour(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URL + `tour/${id}/`, options })
}

const BASE_URLHOTEL = BASE + "apiCrud/hoteles/"

export async function createHotel(tour: any) {
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLHOTEL + "hotel/", options })
}


export async function updateHotel(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLHOTEL + `hotel/${id}/`, options })
}

export async function deleteHotel(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLHOTEL + `hotel/${id}/`, options })
}


const BASE_URLRESTAURANTE = BASE + "apiCrud/restaurantes/"

export async function createRest(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLRESTAURANTE + "restaurante/", options })
}

export async function updateRest(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLRESTAURANTE + `restaurante/${id}/`, options })
}

export async function deleteRest(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLRESTAURANTE + `restaurante/${id}/`, options })
}


const BASE_URLBOLETO = BASE + "apiCrud/boletos/"

export async function createBoleto(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLBOLETO + "boleto/", options })
}

export async function updateBoleto(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLBOLETO + `boleto/${id}/`, options })
}

export async function deleteBoleto(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLBOLETO + `boleto/${id}/`, options })
}



const BASE_URLTRASLADO = BASE + "apiCrud/traslados/"

export async function createTraslado(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLTRASLADO + "traslado/", options })
}

export async function updateTraslado(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTRASLADO + `traslado/${id}/`, options })
}

export async function deleteTraslado(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTRASLADO + `traslado/${id}/`, options })
}


const BASE_URLTREN = BASE + "apiCrud/trenes/"

export async function createTren(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLTREN + "tren/", options })
}

export async function updateTren(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTREN + `tren/${id}/`, options })
}

export async function deleteTren(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTREN + `tren/${id}/`, options })
}


const BASE_URLTRANSPORTE = BASE + "apiCrud/transportes/"

export async function createTransporte(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLTRANSPORTE + "transporte/", options })
}

export async function updateTransporte(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTRANSPORTE + `transporte/${id}/`, options })
}

export async function deleteTransporte(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLTRANSPORTE + `transporte/${id}/`, options })
}
const BASE_URLUPSELLING = BASE + "apiCrud/upsellings/"

export async function createUps(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLUPSELLING + "upselling/", options })
}

export async function updateUps(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLUPSELLING + `upselling/${id}/`, options })
}

export async function deleteUps(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLUPSELLING + `upselling/${id}/`, options })
}

const BASE_URLGUIADO = BASE + "apiCrud/guiados/"

export async function createGuiado(tour: any) {
  // console.log(tour)
  // console.log(tokens)
  console.log(
    localStorage.getItem('authTokens')
  );
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "POST",
    body: tour,
    headers: {
      Authorization: `Bearer ${token}`
    }
    // headers: {
    //     "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryYu134jq7TcPoELmF"
    // }

  }
  return await fetchData({ url: BASE_URLGUIADO + "guiado/", options })
}

export async function updateGuiado(id: number, tour: any) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "PATCH",
    body: JSON.stringify(tour),
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLGUIADO + `guiado/${id}/`, options })
}

export async function deleteGuiado(id: number) {
  const token = JSON.parse(localStorage.getItem('authTokens')!!).access
  const options: RequestInit = {
    method: "DELETE",
    headers:{
      Authorization: `Bearer ${token}`
    }
  }
  return await fetchData({ url: BASE_URLGUIADO + `guiado/${id}/`, options })
}


export async function getFicha(id:number){
  return await fetchFile({url:BASE_FICHA_URL + `ficha/${id}/`})
}

