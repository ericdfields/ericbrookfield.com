import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

export const GET: APIRoute = async () => {
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
                                gap: "24px",
                            },
                            children: [
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "72px",
                                            fontFamily: "Space Grotesk",
                                            fontWeight: 700,
                                            color: "white",
                                            lineHeight: 1.1,
                                        },
                                        children: "Eric Brookfield",
                                    },
                                },
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "32px",
                                            fontFamily: "Inter",
                                            color: "rgba(255, 255, 255, 0.85)",
                                            lineHeight: 1.4,
                                            maxWidth: "800px",
                                        },
                                        children: "Engineering Director & Product Designer",
                                    },
                                },
                            ],
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: {
                                fontSize: "24px",
                                fontFamily: "Inter",
                                color: "rgba(255, 255, 255, 0.7)",
                            },
                            children: "ericbrookfield.com",
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
