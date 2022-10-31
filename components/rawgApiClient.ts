export class RawgApiClient {
  private get = async (url: string, addedQuery?: string) => {
    const fullUrl = `https://api.rawg.io/api/${url}?key=${
      process.env.RAWG_API_KEY
    }${addedQuery ?? ""}`;
    console.log(fullUrl);
    const res = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json();
  };

  async getGames(page: string) {
    const { results } = await this.get("games", `&page=${page}&page_size=20`);
    return results as Game[];
  }

  async getGame(id: string) {
    const game: Game = await this.get(`games/${id}`);
    return game;
  }
}

export type Game = {
  id: number;
  slug: string;
  description_raw: string;
  background_image_additional: string;
  reddit_url: string;
  name: string;
  released: string;
  website: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: AddedByStatus;
  metacritic: number;
  playtime: number;
  developers: Developer[];
  suggestions_count: number;
  updated: string;
  user_game: null;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  platforms: Platform[];
  parent_platforms: ParentPlatform[];
  genres: Genre[];
  stores: Store[];
  clip: null;
  tags: Tag[];
  esrb_rating: EsrbRating;
  short_screenshots: ShortScreenshot[];
};

type Rating = {
  id: number;
  title: string;
  count: number;
  percent: number;
};

type AddedByStatus = {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
};

type Platform = {
  platform: {
    id: number;
    name: string;
    slug: string;
    year_end: null;
    year_start: number;
    games_count: number;
    image_background: string;
  };
  released_at: string;
  requirements_en: {
    minimum: string;
    recommended: string;
  };
  requirements_ru: {
    minimum: string;
    recommended: string;
  };
};

type ParentPlatform = {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
};

type Genre = {
  id: number;
  name: string;
  slug: string;
  image_background: string;
};

type Store = {
  id: number;
  store: {
    id: number;
    name: string;
    slug: string;
  };
};

type Tag = {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
};

type EsrbRating = {
  id: number;
  name: string;
  slug: string;
};

type ShortScreenshot = {
  id: number;
  image: string;
};

type Developer = {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
};
