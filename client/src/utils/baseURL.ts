// Uses NODE_ENV to automatically switch between local and production URLs

export const baseURL: string =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : process.env.NEXT_PUBLIC_API_URL!;
