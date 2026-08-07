export type JSONLDProps = {
  canonical?: string;
  title?: string;
  description?: string;
  image?: string;
  lang?: string;
  pageType?: "webpage" | "about" | "contact" | "faq" | "service" | "collection";
  faqItems?: Array<{ question: string; answer: string }>;
  homepage?: boolean;
  pathname?: string;
  config?: any;
};

type ResolvedJSONLDProps = JSONLDProps & {
  canonical: string;
  title: string;
  description: string;
  lang: string;
  pathname: string;
  config: any;
};

const withoutEmptyValues = <T extends Record<string, any>>(value: T): T =>
  Object.fromEntries(
    Object.entries(value).filter(
      ([, entryValue]) =>
        entryValue !== undefined && entryValue !== null && entryValue !== "",
    ),
  ) as T;

const localizedHomeUrl = (baseUrl: string, lang: string): string =>
  new URL(lang === "en" ? "/en/" : "/", baseUrl).href;

const buildBreadcrumbs = ({
  baseUrl,
  canonical,
  lang,
  pathname,
  title,
}: {
  baseUrl: string;
  canonical: string;
  lang: string;
  pathname: string;
  title: string;
}) => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === lang) segments.shift();
  if (segments.length === 0) return undefined;

  const homeLabel = lang === "en" ? "Home" : "Inicio";
  const items: Array<Record<string, any>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeLabel,
      item: localizedHomeUrl(baseUrl, lang),
    },
  ];

  if (segments[0] === "services" && segments.length > 1) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: lang === "en" ? "Services" : "Servicios",
      item: new URL(lang === "en" ? "/en/services/" : "/services/", baseUrl)
        .href,
    });
  }

  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: title,
    item: canonical,
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: items,
  };
};

export default function JsonLdGenerator(content: ResolvedJSONLDProps) {
  const {
    canonical,
    title,
    description,
    image,
    lang,
    pageType = "webpage",
    faqItems = [],
    homepage = false,
    pathname,
    config,
  } = content;

  const baseUrl = new URL("/", config.site.baseUrl).href;
  const organizationId = `${baseUrl}#organization`;
  const websiteId = `${baseUrl}#website`;
  const founderId = `${baseUrl}#fernando-peralta`;
  const pageId = `${canonical}#webpage`;
  const organization = config.organization;
  const organizationDescription =
    lang === "en" ? config.site.descriptionEn : config.site.description;

  const graph: Array<Record<string, any>> = [
    withoutEmptyValues({
      "@type": "Organization",
      "@id": organizationId,
      name: organization.name,
      url: baseUrl,
      description: organizationDescription,
      foundingDate: organization.foundingDate,
      email: organization.email,
      logo: {
        "@type": "ImageObject",
        "@id": `${baseUrl}#logo`,
        url: new URL(organization.logo, baseUrl).href,
        contentUrl: new URL(organization.logo, baseUrl).href,
        width: 512,
        height: 512,
      },
      founder: { "@id": founderId },
      sameAs: [organization.linkedin],
      areaServed: organization.areaServed.map((name: string) => ({
        "@type": "AdministrativeArea",
        name,
      })),
      knowsLanguage: ["es", "en"],
    }),
    withoutEmptyValues({
      "@type": "Person",
      "@id": founderId,
      name: organization.founder,
      jobTitle:
        lang === "en"
          ? "Founder and technical lead"
          : "Fundador y responsable técnico",
      worksFor: { "@id": organizationId },
      sameAs: organization.founderLinkedin
        ? [organization.founderLinkedin]
        : undefined,
    }),
    withoutEmptyValues({
      "@type": "WebSite",
      "@id": websiteId,
      url: baseUrl,
      name: organization.name,
      description: organizationDescription,
      publisher: { "@id": organizationId },
      inLanguage: ["es", "en"],
    }),
  ];

  const pageSchemaType: Record<string, string> = {
    webpage: "WebPage",
    about: "AboutPage",
    contact: "ContactPage",
    faq: "FAQPage",
    service: "WebPage",
    collection: "CollectionPage",
  };

  const webPage: Record<string, any> = withoutEmptyValues({
    "@type": pageSchemaType[pageType] || "WebPage",
    "@id": pageId,
    url: canonical,
    name: title,
    description,
    inLanguage: lang,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    primaryImageOfPage: image
      ? {
          "@type": "ImageObject",
          url: image,
          contentUrl: image,
        }
      : undefined,
  });

  if (homepage || pageType === "about") {
    webPage.mainEntity = { "@id": organizationId };
  }

  if (pageType === "faq" && faqItems.length > 0) {
    webPage.mainEntity = faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));
  }

  if (pageType === "service") {
    const serviceId = `${canonical}#service`;
    webPage.mainEntity = { "@id": serviceId };
    if (faqItems.length > 0) {
      webPage.subjectOf = { "@id": `${canonical}#faq` };
      graph.push({
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        url: canonical,
        inLanguage: lang,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      });
    }
    graph.push(
      withoutEmptyValues({
        "@type": "Service",
        "@id": serviceId,
        name: title,
        description,
        url: canonical,
        provider: { "@id": organizationId },
        areaServed: organization.areaServed.map((name: string) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        availableLanguage: ["es", "en"],
      }),
    );
  }

  graph.push(webPage);

  const breadcrumbs = buildBreadcrumbs({
    baseUrl,
    canonical,
    lang,
    pathname,
    title,
  });
  if (breadcrumbs) graph.push(breadcrumbs);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
