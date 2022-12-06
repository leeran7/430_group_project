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
    }).catch((err) => console.error(err));
    if (res && res.ok) {
      return res.json();
    }
  };

  async getGames(page: string) {
    const actualPage = (Number(page) - 1).toString();
    const { results } = await this.get(
      "games",
      `&page=${actualPage}&page_size=20`
    );
    return results as Game[];
  }

  async getPopularGames() {
    const { results } = await this.get(
      "games",
      `&metacritic=93,100&page=2&page_size=10`
    );
    return results as Game[];
  }

  async getRecentGames() {
    const { results } = await this.get(
      "games",
      `&dates=2022-01-01,2022-12-31&page=1&page_size=10`
    );
    return results as Game[];
  }

  async getGame(id: string) {
    const game: Game = await this.get(`games/${id}`);
    return game;
  }

  async getTrailer(id: string) {
    const trailer = await this.get(`games/${id}/movies`);
    return trailer as { results: { data?: { max: string } }[] };
  }

  async searchGames(query: string, page: string) {
    const numPage = (Number(page) - 1).toString();
    const { results } = await this.get(
      "games",
      `&search=${query}&metacritic=50,100&page=${numPage}`
    );
    return results as Game[];
  }
}
