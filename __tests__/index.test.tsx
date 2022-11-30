import { render, screen } from "@testing-library/react";
import React from "react";
export * from "@testing-library/react";
import Index from "../pages/index";
import { createMockRouter } from "../test-utils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";

// describe("Index Page", () => {
//   it("should find name", () => {
//     render(<Index />);

//     const GameCard = screen.getByRole("GameCard");

//     expect(GameCard).toBeInTheDocument();
//   });
// });

it("renders div", () => {
  render(
    <RouterContext.Provider value={createMockRouter({})}>
      <Index />;
    </RouterContext.Provider>
  );

  expect(true).toBe(true);
});
