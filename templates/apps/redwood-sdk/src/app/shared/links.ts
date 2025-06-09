import { defineLinks } from "rwsdk/router";

type TLink = ReturnType<typeof defineLinks<["/", "/user/login", "/user/logout"]>>;

export const link: TLink = defineLinks(["/", "/user/login", "/user/logout"]);
