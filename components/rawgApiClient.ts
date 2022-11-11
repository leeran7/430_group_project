import { Game } from "../types";
export class RawgApiClient {
  private get = async (url: string, addedQuery?: string) => {
    const fullUrl = `https://api.rawg.io/api/${url}?key=${
      process.env.RAWG_API_KEY
    }${addedQuery ?? ""}`;

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
