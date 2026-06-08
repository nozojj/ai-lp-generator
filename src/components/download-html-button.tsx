"use client";

export default function DownloadHtmlButton({ html }: { html: string }) {
  const handleDownload = () => {
    const blob = new Blob([html], {
      type: "text/html",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "lp.html";

    a.click();

    URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>HTML出力</button>;
}
