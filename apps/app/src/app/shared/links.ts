import { defineLinks } from "rwsdk/router";

const linkPaths = ["/", "/ping", "/pong"] as const;
type TLinkPaths = typeof linkPaths;
type TLinks = ReturnType<typeof defineLinks<TLinkPaths>>;
export const links: TLinks = defineLinks(linkPaths)

