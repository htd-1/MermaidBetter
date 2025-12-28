import { save } from "@tauri-apps/plugin-dialog";
import { writeFile, writeTextFile } from "@tauri-apps/plugin-fs";

export async function exportSvg(svgContent: string): Promise<boolean> {
  try {
    const filePath = await save({
      filters: [{ name: "SVG Image", extensions: ["svg"] }],
      defaultPath: "diagram.svg",
    });

    if (!filePath) return false;

    await writeTextFile(filePath, svgContent);
    return true;
  } catch (error) {
    console.error("Export SVG failed:", error);
    return false;
  }
}

export async function exportPng(svgContent: string, scale = 2): Promise<boolean> {
  try {
    // Parse SVG to get dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = svgDoc.documentElement;

    // Get dimensions from SVG
    let width = 800;
    let height = 600;

    const widthAttr = svgEl.getAttribute("width");
    const heightAttr = svgEl.getAttribute("height");

    if (widthAttr && heightAttr) {
      width = parseFloat(widthAttr) || width;
      height = parseFloat(heightAttr) || height;
    } else {
      const viewBox = svgEl.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.split(/\s+/);
        if (parts.length >= 4) {
          width = parseFloat(parts[2]) || width;
          height = parseFloat(parts[3]) || height;
        }
      }
    }

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // Fill white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Convert SVG to data URL (avoids CORS/tainted canvas issues)
    const svgBase64 = btoa(unescape(encodeURIComponent(svgContent)));
    const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

    return new Promise((resolve) => {
      const img = new Image();

      img.onload = async () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          // Get PNG data URL
          const pngDataUrl = canvas.toDataURL("image/png", 1.0);
          const base64Data = pngDataUrl.split(",")[1];

          // Convert base64 to bytes
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Get file path
          const filePath = await save({
            filters: [{ name: "PNG Image", extensions: ["png"] }],
            defaultPath: "diagram.png",
          });

          if (!filePath) {
            resolve(false);
            return;
          }

          await writeFile(filePath, bytes);
          resolve(true);
        } catch (error) {
          console.error("Export PNG failed:", error);
          resolve(false);
        }
      };

      img.onerror = (err) => {
        console.error("Failed to load SVG image:", err);
        resolve(false);
      };

      img.src = dataUrl;
    });
  } catch (error) {
    console.error("Export PNG failed:", error);
    return false;
  }
}

export function getSvgFromPreview(): string | null {
  const svgElement = document.querySelector(".mermaid-output svg") as SVGSVGElement;
  if (!svgElement) return null;

  // Clone SVG
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Get bounding box for proper dimensions
  const bbox = svgElement.getBBox();
  const padding = 20;

  // Set explicit dimensions
  const width = Math.ceil(bbox.width + padding * 2);
  const height = Math.ceil(bbox.height + padding * 2);

  clonedSvg.setAttribute("width", String(width));
  clonedSvg.setAttribute("height", String(height));
  clonedSvg.setAttribute("viewBox", `${bbox.x - padding} ${bbox.y - padding} ${width} ${height}`);

  // Ensure xmlns attributes
  clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  // Handle foreignObject elements - try to preserve text content
  const foreignObjects = clonedSvg.querySelectorAll("foreignObject");
  foreignObjects.forEach((fo) => {
    // Get text content from foreignObject
    const textContent = fo.textContent?.trim();
    if (textContent) {
      // Create SVG text element as fallback
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const x = fo.getAttribute("x") || "0";
      const y = fo.getAttribute("y") || "0";
      const width = parseFloat(fo.getAttribute("width") || "100");
      const height = parseFloat(fo.getAttribute("height") || "20");

      text.setAttribute("x", String(parseFloat(x) + width / 2));
      text.setAttribute("y", String(parseFloat(y) + height / 2));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", "#333333");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-family", "arial, sans-serif");
      text.textContent = textContent;

      fo.parentNode?.replaceChild(text, fo);
    } else {
      fo.remove();
    }
  });

  // Add white background as first element
  const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bgRect.setAttribute("x", String(bbox.x - padding));
  bgRect.setAttribute("y", String(bbox.y - padding));
  bgRect.setAttribute("width", String(width));
  bgRect.setAttribute("height", String(height));
  bgRect.setAttribute("fill", "#ffffff");
  clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

  // Inline all styles to make SVG self-contained
  const styleSheets = document.styleSheets;
  let cssText = "";

  try {
    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.cssText.includes(".mermaid") || rule.cssText.includes("svg")) {
            cssText += rule.cssText + "\n";
          }
        }
      } catch {
        // Skip external stylesheets due to CORS
      }
    }
  } catch {
    // Ignore stylesheet access errors
  }

  // Get computed styles from original SVG elements and apply inline
  const originalElements = svgElement.querySelectorAll("*");
  const clonedElements = clonedSvg.querySelectorAll("*");

  clonedElements.forEach((el, index) => {
    const originalEl = originalElements[index];
    if (!originalEl) return;

    // Ensure text elements have explicit fill
    if (el.tagName === "text" || el.tagName === "tspan") {
      try {
        const computed = window.getComputedStyle(originalEl);
        const currentFill = el.getAttribute("fill");
        if (!currentFill || currentFill === "none" || currentFill === "") {
          const fillColor = computed.fill;
          if (fillColor && fillColor !== "none" && fillColor !== "rgb(0, 0, 0)") {
            el.setAttribute("fill", fillColor);
          } else {
            el.setAttribute("fill", "#333333");
          }
        }
        // Also set font properties
        if (!el.getAttribute("font-family")) {
          el.setAttribute("font-family", computed.fontFamily || "arial, sans-serif");
        }
      } catch {
        el.setAttribute("fill", "#333333");
      }
    }
  });

  return new XMLSerializer().serializeToString(clonedSvg);
}
