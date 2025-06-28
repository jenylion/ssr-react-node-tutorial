import express from "express";
import { createServer as createViteServer } from "vite";

const app = express();

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.get("*", async (req, res) => {
    try {
      const url = req.originalUrl;
      const template = await vite.transformIndexHtml(
        url,
        `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR React + Node</title>
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>
      `
      );

      const render = (await vite.ssrLoadModule("/src/main.jsx")).default;
      const appHtml = render();

      const html = template.replace(
        `<div id="root"></div>`,
        `<div id="root">${appHtml}</div>`
      );
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

createServer();
