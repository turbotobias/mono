export declare const get_seo: ({ title, description, keywords, image, }: {
    title: string;
    description?: string;
    image?: string;
    keywords?: string;
}) => Array<{
    title: string;
    content?: string;
    name?: string;
} | {
    title: undefined;
    content?: string;
    name?: string;
}>;
//# sourceMappingURL=seo.d.ts.map