import { sample, concat, isArray } from "lodash";
import { config } from "../config";
import axios from "axios";
import { stringify } from "querystring";
const data = require("../data/internet_health_report.json");
const END_POINT = "https://www.googleapis.com/youtube/v3/search?";
const MAX_RESULTS = 10;
const DEFAULT_VIDEO = "ZY3J3Y_OU0w"; // yule log

export class VideoIdList {
  private idList: string[] = [];

  private searchYoutube = async (term: string): Promise<string | null> => {
    const params = {
      q: term,
      maxResults: MAX_RESULTS,
      key: config.YOUTUBE_API_KEY,
      part: "snippet"
    };

    try {
      const response = await axios.get(END_POINT + stringify(params));
      return response.data.items.length > 0 && response.data.items[0].id
        ? response.data.items.map((item: any) => item.id.videoId)
        : DEFAULT_VIDEO;
    } catch (err) {
      console.log(err);
      return DEFAULT_VIDEO;
    }
  };

  public init = async () => {
    await this.getMore(5);
  };

  private getSome = async () => {
    const term = sample(data) as string;
    const ids = await this.searchYoutube(term);

    if (ids) {
      isArray(ids) ? this.idList.concat(ids) : this.idList.push(ids);
      return true;
    }

    return false;
  };

  private getMore = async (n: number = 5) => {
    await Promise.all(new Array(n).fill(null).map(a => this.getSome()));
    if (this.idList.length < n) {
      await this.getMore(n);
    }
  };

  public getVideoId = async (): Promise<string> => {
    if (this.idList.length === 0) {
      await this.getMore();
    }
    return this.idList.pop() as string;
  };
}
