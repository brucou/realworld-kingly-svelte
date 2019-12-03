import { viewModel } from "../constants";

const {
  fetchStatus: [LOADING, NOK, OK]
} = viewModel;

export function computeFetchStatus(obj) {
  if (obj instanceof Error) {
    return NOK;
  } else if (typeof obj === "string") {
    return LOADING;
  } else if (typeof obj === "object") {
    return OK;
  } else {
    throw `computeFetchStatus: invalid parameter!`;
  }
}

export const formatDate = date => new Date(date).toDateString();
