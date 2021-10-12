import checkResponse from "./checkResponse";
import { fetchOptionsI } from "../types";

const fetcher = (...args) => fetch(...args as [string, fetchOptionsI]).then(res => {
  checkResponse(res);
  return res.json();
})
.catch(err => {
  return {error:err};
});
  
export default fetcher;