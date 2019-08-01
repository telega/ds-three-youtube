import { sample } from "lodash";

const idList = [
  "SJOz3qjfQXU",
  "Y2-xZ-1HE-Q",
  "IrydklNpcFI",
  "9ubytEsCaS0",
  "ZY3J3Y_OU0w",
  "VBTAcACmcgo"
];

export const getVideoId = () => sample(idList) as String;
