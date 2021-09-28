
import { fetchOptionsI } from "../types";

export default async function fetchJson(...args) {
  try {
    const response = await fetch(...args as [string, fetchOptionsI]);

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    const error: {[k: string]: any} = new Error(response.statusText);
    error.response = response;
    error.data = data;
    throw error;
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message };
    }
    throw error;
  }
}
