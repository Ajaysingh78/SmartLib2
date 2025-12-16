import axios from "axios";

export async function getDepartmentBook(url) {
  try {
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    throw error;
  }
}


export async function getBookByID(url) {
  try {
    const { data } = await axios.get(url);
    return data.data;
  } catch (error) {
    throw error;
  }
}
