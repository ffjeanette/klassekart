// src/types/pdfjs-dist-legacy.d.ts
declare module "pdfjs-dist/legacy/build/pdf" {
    import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
    export * from "pdfjs-dist";
    export function getDocument(src: string | Uint8Array): any;
    export type { PDFDocumentProxy };
  }
  
  declare module "pdfjs-dist/legacy/build/pdf.worker.entry" {
    const worker: string;
    export default worker;
  }
  