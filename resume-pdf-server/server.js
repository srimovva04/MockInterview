const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/generate-pdf", async (req, res) => {
  const { resumeHtml, fileName } = req.body;
  if (!resumeHtml) return res.status(400).json({ error: "No resume HTML provided" });

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: white;
          }

          body {
            font-family: 'Libre Baskerville', Georgia, serif;
            font-size: 12px;
            line-height: 1.5;
            color: #111827;
            letter-spacing: 0.01em;
          }
          margin-bottom: 0 !important; /* Reduced bottom margin */

          .resume-wrapper {
           width: 100%;
           margin: 0;
           padding: 0;
          }

          h1 {
            font-size: 1.5rem;
            font-weight: 900;
            text-transform: uppercase;
            margin-top: 0.2rem; /* Add this */
            margin-bottom: 0.5rem; /* Optional: reduce bottom spacing too */
          }

          h3 {
            font-size: 0.875rem;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #374151;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #374151;
          }

          p, li {
            margin: 0.25rem 0;
          }

          ul {
            list-style-type: disc;
            padding-left: 1.25rem;
            margin-top: 0.25rem;
          }
        </style>
      </head>
      <body>
        <div class="resume-wrapper">
          ${resumeHtml}
        </div>
      </body>
    </html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const height = await page.evaluate(() => document.documentElement.scrollHeight);

    // Set PDF size to A4 (8.27in x 11.69in)
    const pdfBuffer = await page.pdf({
      format: "A4", // Ensures exact A4 dimensions: 8.27in × 11.69in
  printBackground: true,
  margin: {
    top: "0.2in",
    bottom: "0.2in",
    left: "0.25in",     // Adds space on the left
    right: "0.25in",    // Adds space on the right
  },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName || "resume"}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

app.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
