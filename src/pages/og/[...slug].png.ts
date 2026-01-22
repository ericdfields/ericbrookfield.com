import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection("blog");

    return posts.map((post) => {
        const urlMatch = post.data.url.match(
            /\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\.html/
        );
        const slug = urlMatch
            ? `${urlMatch[1]}/${urlMatch[2]}/${urlMatch[3]}/${urlMatch[4]}`
            : `blog/${post.slug}`;

        const plainText = post.body
            .replace(/<[^>]*>/g, "")
            .replace(/\n+/g, " ")
            .trim();

        const title =
            post.data.title ||
            (plainText ? plainText.substring(0, 95) + "..." : "No content");

        return {
            params: { slug },
            props: { title, date: post.data.date },
        };
    });
};

export const GET: APIRoute = async ({ props }) => {
    const { title, date } = props as { title: string; date: Date };

    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).toUpperCase();

    // Load fonts from fontsource packages
    const spaceGroteskBold = fs.readFileSync(
        path.join(process.cwd(), "node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff")
    );
    const interRegular = fs.readFileSync(
        path.join(process.cwd(), "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff")
    );

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "60px",
                    background: "linear-gradient(135deg, #1A5F5A 0%, #2A7A74 50%, #E07A3D 100%)",
                },
                children: [
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            },
                            children: [
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "24px",
                                            fontFamily: "Inter",
                                            color: "rgba(255, 255, 255, 0.8)",
                                            letterSpacing: "0.1em",
                                        },
                                        children: formattedDate,
                                    },
                                },
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: title.length > 60 ? "48px" : "56px",
                                            fontFamily: "Space Grotesk",
                                            fontWeight: 700,
                                            color: "white",
                                            lineHeight: 1.2,
                                            maxWidth: "1000px",
                                        },
                                        children: title,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: {
                                fontSize: "28px",
                                fontFamily: "Space Grotesk",
                                fontWeight: 700,
                                color: "rgba(255, 255, 255, 0.9)",
                            },
                            children: "Eric Brookfield",
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Space Grotesk",
                    data: spaceGroteskBold,
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "Inter",
                    data: interRegular,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    );

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(png, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
