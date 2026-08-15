import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

interface HomeFormProps {
  bannerUrl?: string;
  locale?: "es" | "en";
  name?: string;
}

function HomeForm({
  bannerUrl = "https://devstoremx.xyz/media/devstoremx-email-banner-final.png",
  locale = "es",
  name,
}: HomeFormProps) {
  const copy =
    locale === "en"
      ? {
          button: "Visit website",
          description: `${name ? `Hi ${name}, ` : ""}someone from our team will contact you soon to help with your request. In the meantime, visit our website to learn about our services and projects.`,
          heading: "Thanks for contacting us!",
          preview: "We received your message at DevStoreMX",
        }
      : {
          button: "Visitar sitio web",
          description: `${name ? `Hola ${name}, ` : ""}pronto alguien de nuestro equipo se pondrá en contacto contigo para ayudarte con tu solicitud. Mientras tanto, visita nuestro sitio para conocer nuestros servicios y proyectos.`,
          heading: "¡Gracias por contactarnos!",
          preview: "Recibimos tu mensaje en DevStoreMX",
        };

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Tailwind>
        <Body className="m-0 bg-slate-100 px-[12px] py-[40px] font-mono text-gray-900">
          <Container className="mx-auto max-w-[600px] overflow-hidden rounded-[16px] bg-white">
            <Section>
              <Img
                alt="DevStoreMX, desarrollo web y software"
                className="block h-auto w-full"
                height="300"
                src={bannerUrl}
                style={{ display: "block", maxWidth: "100%", width: "100%" }}
                width="600"
              />
              <Section className="px-[32px] pt-[28px] pb-[36px] text-center">
                <Text className="m-0 text-[13px] leading-[20px] font-semibold tracking-[2px] text-[#5271ff] uppercase">
                  DevStoreMX
                </Text>
                <Heading
                  as="h1"
                  className="m-0 mt-[10px] text-[34px] leading-[40px] font-semibold text-gray-900"
                >
                  {copy.heading}
                </Heading>
                <Text className="mx-auto mt-[16px] mb-0 max-w-[500px] text-[16px] leading-[26px] text-gray-600">
                  {copy.description}
                </Text>
                <Button
                  className="mt-[24px] rounded-[8px] bg-[#5271ff] px-[40px] py-[13px] font-mono text-[15px] font-semibold text-white"
                  href="https://devstoremx.xyz"
                >
                  {copy.button}
                </Button>
              </Section>
            </Section>

            <Hr className="m-0 border-0 border-t border-solid border-slate-200" />

            <Section className="px-[32px] py-[28px] text-center">
              <Img
                alt="Logotipo de DevStoreMX"
                className="mx-auto"
                height="48"
                src="https://devstoremx.xyz/media/devstoremx.png"
                width="40"
              />
              <Text className="mt-[12px] mb-0 text-[16px] leading-[24px] font-semibold text-gray-900">
                DEVSTOREMX
              </Text>
              <Link
                className="mt-[14px] inline-block"
                href="https://www.linkedin.com/company/devstoremx/"
              >
                <Img
                  alt="LinkedIn de DevStoreMX"
                  className="mx-auto"
                  height="28"
                  src="https://img.icons8.com/ios-filled/56/5271ff/linkedin.png"
                  width="28"
                />
              </Link>
              <Text className="mt-[12px] mb-0 text-[14px] leading-[22px] text-gray-500">
                <Link
                  className="text-gray-500 no-underline"
                  href="mailto:hola@devstoremx.xyz"
                >
                  hola@devstoremx.xyz
                </Link>
              </Text>
            </Section>

            <Section className="bg-slate-50 px-[32px] py-[24px]">
              <Link
                className="block no-underline"
                href="https://www.linkedin.com/in/fernandodperaltac/"
              >
                <Row>
                  <Column className="w-[64px] align-middle">
                    <Img
                      alt="Fernando Peralta"
                      className="h-[52px] w-[52px] rounded-full object-cover"
                      height="52"
                      src="https://devstoremx.xyz/images/team/fernando-peralta.jpg"
                      width="52"
                    />
                  </Column>
                  <Column className="align-middle">
                    <Text className="m-0 text-[14px] leading-[21px] font-semibold text-gray-900">
                      Fernando Peralta
                    </Text>
                    <Text className="m-0 text-[12px] leading-[18px] text-gray-500">
                      Founder &amp; Technical Lead
                    </Text>
                  </Column>
                </Row>
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

HomeForm.PreviewProps = {
  bannerUrl: "/static/devstoremx-email-banner-final.png",
  locale: "es",
  name: "Fernando",
} satisfies HomeFormProps;

export default HomeForm;
