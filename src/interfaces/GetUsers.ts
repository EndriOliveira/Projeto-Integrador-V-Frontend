export type sortBy = "name" | "email" | "role" | "createdAt" | "updatedAt";
export type sortType = "asc" | "desc";

export type GetUsersParams = {
  page: number;
  limit: number;
  search?: string;
  sortBy: sortBy;
  sortType: sortType;
};
