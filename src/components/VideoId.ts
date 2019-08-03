import { sample } from "lodash";
import { config } from "../config";
// import { data } from "../data/data";
import axios from "axios";
import { stringify } from "querystring";

const END_POINT = "https://www.googleapis.com/youtube/v3/search?";
const MAX_RESULTS = 1;

export const searchYoutube = async (term: string) => {
  const params = {
    q: term,
    maxResults: MAX_RESULTS,
    key: config.YOUTUBE_API_KEY,
    part: "snippet"
  };

  const response = await axios.get(END_POINT + stringify(params));

  console.log(response.data);
};

const idList = [
  "SJOz3qjfQXU",
  "Y2-xZ-1HE-Q",
  "IrydklNpcFI",
  "9ubytEsCaS0",
  "ZY3J3Y_OU0w",
  "VBTAcACmcgo"
];

export const getVideoId = () => sample(idList) as string;
