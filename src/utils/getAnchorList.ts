export const getAnchorList = (html: string): Array<string> => {
  const regexpMap = {
    allAnchors: /<a[^>]*href="[^"]*"[^>]*>.*?<\/a>/g,
    elementsWithStretchedLink: /class="[^"]*stretched-link[^"]*"/,
    detailsHref: /href="[^"]*Ads\/details[^"]*"/,
    urlRegex: /href="([^"]+)"/,
  };

  const {
    allAnchors,
    elementsWithStretchedLink,
    detailsHref,
    urlRegex
  } = regexpMap;

  const anchors = html.match(allAnchors) || [];
  return anchors
    .filter((anchor: string) => elementsWithStretchedLink.test(anchor))
    .filter((anchor: string) => detailsHref.test(anchor))
    .map((anchor: any) => {
      const match = anchor.match(urlRegex);
      return match ? match[1] : null;
    })
    .filter((url: any): boolean => url !== null);
};
