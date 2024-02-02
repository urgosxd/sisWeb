const ERROR_MSG = "Oops! Something went wrong" ;

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
 
// const BASE_URL = "https://siswebbackend.pdsviajes.com/apiCrud/tours/"
const BASE_URL = "http://127.0.0.1:8000/apiCrud/tours/"
export async function createTour (tour:any){
  console.log(tour)
  const options:RequestInit = {
    method: "POST",
    body: tour,
    // headers: {
    //    Accept: "application/json, text/plain",
    //     "Content-Type": "application/json;charset=UTF-8"
    // }
  }
  return await fetchData({url:BASE_URL + "tour/",options})
}
export async function updateTour (id:string,tour:any){
  const options:RequestInit = {
    method: "PUT",
    body: JSON.stringify(tour),
    headers: {
       Accept: "application/json, text/plain",
        // "Content-Type": "application/json;charset=UTF-8"
    }
  }
  return await fetchData({url:BASE_URL + `tour/${id}`,options})
}
export async function deleteTour (id:string,tour:any){
  const options:RequestInit = {
    method: "DELETE",
    body: JSON.stringify(tour),
    headers: {
       Accept: "application/json, text/plain",
        "Content-Type": "application/json;charset=UTF-8"
    }
  }
  return await fetchData({url:BASE_URL + `tour/${id}`,options})
}
