import Script from "next/script";
import { site } from "@/data/site";

/** Google tag (gtag.js) as installed by Site Kit on WordPress. */
export default function GoogleTag() {
  const id = site.googleTagId;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
