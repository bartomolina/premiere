"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

import { ProfileSearchSuggestions } from "./profile-search-suggestions";

export function ProfileSearch() {
  const [query, setQuery] = useState("");

  return (
    <>
      <div className="dropdown relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlass className="h-5" size={20} alt="Search" />
        </div>
        <input
          type="text"
          placeholder="Search profile"
          value={query}
          onChange={(event_) => setQuery(event_.target.value)}
          tabIndex={0}
          className="sm:w-auto w-24 input-bordered input-primary input input-sm pl-10 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
        />
        <ProfileSearchSuggestions query={query} setQuery={setQuery} />
      </div>
    </>
  );
}
