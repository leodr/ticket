//
// Selectors
//
const eEmptyState = document.querySelector<HTMLDivElement>("#empty-state")!;
const eNonEmptyScreen =
  document.querySelector<HTMLDivElement>("#non-empty-screen")!;

const eFirstCanvas =
  document.querySelector<HTMLCanvasElement>("#first-canvas")!;
const eSecondCanvas =
  document.querySelector<HTMLCanvasElement>("#second-canvas")!;

const eFileInput = document.querySelector<HTMLInputElement>("#file-input")!;

const eFirstImage = document.querySelector<HTMLImageElement>("#first-image")!;
const eSecondImage = document.querySelector<HTMLImageElement>("#second-image")!;
//
// End of selectors
//

const PDFJSPromise = import("pdfjs-dist");
// @ts-expect-error: pdfjs-dist has no types for worker entry
const PDFJSWorkerPromise = import("pdfjs-dist/build/pdf.worker.entry");

let PDFJS: typeof import("pdfjs-dist") | undefined = undefined;
let PDFJSWorker: string | undefined = undefined;

initialize();

eFileInput?.addEventListener("change", async (e) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  if (!PDFJS || !PDFJSWorker) {
    [PDFJS, PDFJSWorker] = await Promise.all([
      PDFJSPromise,
      PDFJSWorkerPromise,
    ]);

    // @ts-expect-error: this has been assigned just above so it will work.
    PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
  }

  try {
    const pdfURL = URL.createObjectURL(file);
    const pdfDocument = await PDFJS.getDocument(pdfURL).promise;
    URL.revokeObjectURL(pdfURL);

    const firstPage = await pdfDocument.getPage(1);

    const firstRenderTask = firstPage.render({
      canvasContext: eFirstCanvas.getContext("2d")!,
      viewport: firstPage.getViewport({
        scale: 5.64,
        offsetX: -352,
        offsetY: -436,
      }),
    });
    const secondRenderTask = firstPage.render({
      canvasContext: eSecondCanvas.getContext("2d")!,
      viewport: firstPage.getViewport({
        scale: 5.64,
        offsetX: -1199,
        offsetY: -436,
      }),
    });

    await Promise.all([firstRenderTask.promise, secondRenderTask.promise]);

    const firstImg = eFirstCanvas.toDataURL("image/png");
    const secondImg = eSecondCanvas.toDataURL("image/png");

    localStorage.setItem("first-data-url", firstImg);
    localStorage.setItem("second-data-url", secondImg);

    showImages(firstImg, secondImg);
  } catch (e) {
    console.error(e);
  }
});

function initialize() {
  const cachedFirstImage = localStorage.getItem("first-data-url");
  const cachedSecondImage = localStorage.getItem("second-data-url");

  if (cachedFirstImage && cachedSecondImage) {
    showImages(cachedFirstImage, cachedSecondImage);
  } else {
    showEmptyState();
  }
}

function showEmptyState() {
  eEmptyState.style.display = "flex";
  eNonEmptyScreen.style.display = "none";
}

function showImages(firstImg: string, secondImg: string) {
  if (firstImg && secondImg) {
    eFirstImage.setAttribute("src", firstImg);
    eSecondImage.setAttribute("src", secondImg);

    eEmptyState.style.display = "none";
    eNonEmptyScreen.style.display = "flex";
  }
}
