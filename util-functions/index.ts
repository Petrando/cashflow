import * as d3 from "d3";

export const rupiahFormatter = (value:number):string => `Rp ${d3.format(",")(value)}`