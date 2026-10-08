import {
  defaultTitle,
  faqs as homeFaqs,
  memberSlug,
  metaDescription,
  ogImageAlt,
  organizationSameAs,
  postalAddress,
  publicValue,
  services,
  shopifyPartner,
  site,
  team,
  technologies,
} from '../data/landing.ts';
import { absoluteUrl } from './seo.ts';

export interface Crumb {
  name: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StructuredInput {
  origin: string;
  pathname: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  variant?: 'home' | 'page' | 'service' | 'article';
  breadcrumbs?: Crumb[];
  faqs?: readonly FaqItem[];
  serviceName?: string;
  serviceType?: string;
  article?: {
    headline: string;
    datePublished: Date;
    dateModified: Date;
    authorSlug: string;
    image?: string;
  };
  howTo?: {
    name: string;
    description: string;
    steps: readonly { name: string; text: string }[];
  };
  blogPosts?: readonly { headline: string; href: string; datePublished: Date; authorSlug: string; image: string }[];
}

function personNode(origin: string, member: (typeof team)[number]) {
  const slug = memberSlug(member.image);
  const linkedin = publicValue(member.linkedin);
  const portfolio = publicValue(member.portfolio);
  const sameAs = [linkedin, portfolio].filter((link): link is string => Boolean(link));
  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': `${origin}/#${slug}`,
    name: member.name,
    jobTitle: member.role,
    image: new URL(member.image, origin).href,
    worksFor: { '@id': `${origin}/#organization` },
  };
  if (portfolio || linkedin) person.url = portfolio || linkedin;
  if (sameAs.length) person.sameAs = sameAs;
  if (member.bio) person.description = member.bio;
  return person;
}

export function buildStructuredGraph(input: StructuredInput) {
  const origin = input.origin.replace(/\/$/, '');
  const variant = input.variant ?? 'home';
  const title = input.title ?? defaultTitle;
  const description = input.description ?? metaDescription();
  const pageUrl = absoluteUrl(origin, input.pathname);
  const organizationId = `${origin}/#organization`;
  const websiteId = `${origin}/#website`;
  const webpageId = `${pageUrl}#webpage`;
  const sameAs = organizationSameAs();
  const email = publicValue(site.email);
  const phone = publicValue(site.phone);
  const location = publicValue(site.location);
  const organizationDescription = metaDescription();
  const imagePath = input.image || input.article?.image || site.ogImage;

  const organization: Record<string, unknown> = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': organizationId,
    name: 'Devstoremx',
    alternateName: [...site.alternateName],
    url: `${origin}/`,
    slogan: 'Sitios que venden. Código que dura.',
    logo: {
      '@type': 'ImageObject',
      url: new URL('/devstoremx.svg', origin).href,
    },
    image: new URL(site.ogImage, origin).href,
    description: organizationDescription,
    areaServed: { '@type': 'Country', name: 'México' },
    knowsAbout: [...technologies],
  };

  if (shopifyPartner.registered) {
    organization.memberOf = {
      '@type': 'Organization',
      name: 'Shopify Partners',
      url: 'https://www.shopify.com/partners',
    };
    organization.identifier = {
      '@type': 'PropertyValue',
      propertyID: 'Shopify Partner ID',
      value: shopifyPartner.id,
    };
  }
  if (sameAs.length) organization.sameAs = sameAs;
  if (email) organization.email = email;
  if (phone) organization.telephone = phone;
  if (location) organization.address = postalAddress(location);

  const webpage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': webpageId,
    url: pageUrl,
    name: title,
    description,
    inLanguage: 'es-MX',
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: new URL(imagePath, origin).href,
      width: 1200,
      height: 630,
      caption: input.imageAlt || ogImageAlt,
    },
  };

  const graph: Record<string, unknown>[] = [
    organization,
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${origin}/`,
      name: 'Devstoremx',
      alternateName: [...site.alternateName],
      description: organizationDescription,
      inLanguage: 'es-MX',
      publisher: { '@id': organizationId },
    },
    webpage,
  ];

  if (variant === 'home') {
    const serviceNodes = [...new Map(services.map((service) => {
      const url = absoluteUrl(origin, service.href);
      return [url, {
        '@type': 'Service',
        '@id': url,
        name: service.title,
        description: service.description,
        url,
        serviceType: service.title,
        provider: { '@id': organizationId },
        areaServed: { '@type': 'Country', name: 'México' },
      }];
    })).values()];
    organization.hasOfferCatalog = { '@id': `${origin}/#catalogo` };
    graph.push(
      ...serviceNodes,
      {
        '@type': 'OfferCatalog',
        '@id': `${origin}/#catalogo`,
        name: 'Servicios de desarrollo web',
        itemListElement: serviceNodes.map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': service['@id'] },
        })),
      },
      ...team.map((member) => personNode(origin, member)),
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        url: `${origin}/#preguntas`,
        isPartOf: { '@id': webpageId },
        mainEntity: homeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    );
  }

  if (variant === 'service') {
    const card = services.find((service) => canonicalHref(service.href) === canonicalHref(input.pathname));
    const serviceNode = {
      '@type': 'Service',
      '@id': pageUrl,
      name: card?.title ?? input.serviceName ?? title,
      description: card?.description ?? description,
      url: pageUrl,
      serviceType: input.serviceType ?? card?.title ?? input.serviceName ?? title,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'México' },
    };
    webpage.about = { '@id': pageUrl };
    graph.push(serviceNode);
  }

  if (variant === 'article' && input.article) {
    const author = team.find((member) => memberSlug(member.image) === input.article?.authorSlug);
    if (author) graph.push(personNode(origin, author));
    webpage.about = { '@id': `${pageUrl}#article` };
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${pageUrl}#article`,
      headline: input.article.headline,
      description,
      datePublished: input.article.datePublished.toISOString(),
      dateModified: input.article.dateModified.toISOString(),
      inLanguage: 'es-MX',
      image: new URL(imagePath, origin).href,
      author: { '@id': `${origin}/#${input.article.authorSlug}` },
      publisher: { '@id': organizationId },
      mainEntityOfPage: { '@id': webpageId },
      url: pageUrl,
    });
    if (input.howTo) {
      graph.push({
        '@type': 'HowTo',
        '@id': `${pageUrl}#howto`,
        name: input.howTo.name,
        description: input.howTo.description,
        inLanguage: 'es-MX',
        step: input.howTo.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }
  }

  if (input.blogPosts?.length) {
    const authorSlugs = new Set(input.blogPosts.map((post) => post.authorSlug));
    graph.push(...team.filter((member) => authorSlugs.has(memberSlug(member.image))).map((member) => personNode(origin, member)));
    webpage.mainEntity = { '@id': `${pageUrl}#blog` };
    graph.push({
      '@type': 'Blog',
      '@id': `${pageUrl}#blog`,
      name: title,
      description,
      inLanguage: 'es-MX',
      url: pageUrl,
      publisher: { '@id': organizationId },
      blogPost: input.blogPosts.map((post) => ({
        '@type': 'BlogPosting',
        '@id': `${absoluteUrl(origin, post.href)}#article`,
        headline: post.headline,
        datePublished: post.datePublished.toISOString(),
        author: { '@id': `${origin}/#${post.authorSlug}` },
        image: new URL(post.image, origin).href,
        url: absoluteUrl(origin, post.href),
      })),
    });
  }

  if (input.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: input.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(origin, crumb.href),
      })),
    });
  }

  if (variant !== 'home' && input.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      url: pageUrl,
      isPartOf: { '@id': webpageId },
      mainEntity: input.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function canonicalHref(href: string) {
  return href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href;
}
