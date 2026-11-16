import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { CurriculumEntry } from "@/components/curriculum-entry";
import { SocialLinks } from "@/components/social-links";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { contact, emailHref, phoneHref, whatsappHref } from "@/data/contact";
import { curriculum } from "@/data/curriculum";
import { faqs } from "@/data/faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Path to Qur'anic Understanding — School Portal" },
      {
        name: "description",
        content:
          "A structured programme in the classical Islamic sciences: Nahwu, Sarf, Hadith, and As-Sarim Al-Battar. Accounts are issued by the school administration.",
      },
      { property: "og:title", content: "Path to Qur'anic Understanding — School Portal" },
      {
        property: "og:description",
        content:
          "A structured programme in the classical Islamic sciences (Nahwu, Sarf, Hadith, and As-Sarim Al-Battar), taught as one integrated curriculum.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const primaryButton =
  "inline-flex h-12 items-center justify-center rounded-md bg-amber px-7 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft";
const secondaryButton =
  "inline-flex h-12 items-center justify-center rounded-md border border-amber/60 px-7 text-sm font-semibold tracking-wide text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10";

function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section
        id="programme"
        aria-labelledby="hero-heading"
        className="hero-gradient border-b border-border/60"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber">
              Enrolling now
            </p>

            <h1
              id="hero-heading"
              className="mt-8 text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl"
            >
              Path to Qur&apos;anic Understanding
            </h1>

            <h2
              dir="rtl"
              lang="ar"
              className="mt-6 font-arabic text-3xl font-normal leading-[1.7] text-amber sm:text-4xl lg:text-5xl"
            >
              طريق فهم القرآن
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-foreground/90 sm:text-lg">
              A structured programme in the classical Islamic sciences — Arabic grammar (Nahwu),
              morphology (Sarf), prophetic tradition (Hadith), and As-Sarim Al-Battar — taught so
              that students read the Qur&apos;an with understanding and act upon what they learn.
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link to="/login" className={primaryButton}>
                Sign in to the portal
              </Link>
              <Link to="/signup" className={secondaryButton}>
                Sign up
              </Link>
              <a href="#curriculum" className={secondaryButton}>
                Explore the curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Curriculum */}
        <section
          id="curriculum"
          aria-labelledby="curriculum-heading"
          className="py-20 sm:py-24 lg:py-28"
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
                Curriculum
              </p>
              <h2
                id="curriculum-heading"
                className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl"
              >
                The subjects we teach
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {curriculum.length} core subjects, taught as one integrated programme
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {curriculum.map((course, index) => (
              <CurriculumEntry key={course.id} course={course} index={index} />
            ))}
          </div>
        </section>

        {/* Founder */}
        <section id="about" aria-labelledby="about-heading" className="pb-20 sm:pb-24 lg:pb-28">
          <div className="rounded-xl border border-border bg-card/90 p-6 shadow-sm sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">About</p>
              <h2
                id="about-heading"
                className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl"
              >
                Learning that leads to action
              </h2>

              <blockquote className="mt-8 border-l-2 border-amber/70 pl-5 text-left sm:pl-6">
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arabic text-2xl leading-[1.9] text-amber sm:text-3xl"
                >
                  نتعلم لنفهم ونفهم لنعمل ونعمل لنرضي به الله
                </p>
                <footer className="mt-4 text-base leading-relaxed text-foreground/90 sm:text-lg">
                  “We learn to understand, understand to act, and act to please Allah.”
                </footer>
              </blockquote>

              <p className="mt-8 leading-relaxed text-muted-foreground">
                “I love teaching and enlightening people with what Allah has bestowed on me, by His
                blessing.”
              </p>

              <div className="mt-10 flex flex-col items-center">
                <img
                  src="/assets/aistudio/file_000000001f1c81f480c6e33a83b06779_df73c98b.png"
                  alt="Munirudeen, founder and teacher"
                  loading="lazy"
                  width={160}
                  height={160}
                  className="size-32 rounded-full border-2 border-amber/50 object-cover object-top shadow-md sm:size-40"
                />
                <p className="mt-5 font-display text-2xl font-semibold">Munirudeen</p>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-amber">
                  Founder &amp; Teacher
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">
              Frequently asked
            </p>
            <h2
              id="faq-heading"
              className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl"
            >
              Questions about the programme
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10 w-full">
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-border">
                <AccordionTrigger className="py-6 text-left font-display text-lg font-medium hover:text-amber hover:no-underline sm:text-xl [&>svg]:size-5 [&>svg]:text-amber">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-heading" className="pb-20 sm:pb-24 lg:pb-28">
          <div className="rounded-xl border border-border bg-card/90 p-6 shadow-sm sm:p-10">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber">Contact</p>
                <h2
                  id="contact-heading"
                  className="mt-3 text-balance font-display text-3xl font-semibold sm:text-4xl"
                >
                  Speak with the school
                </h2>
                <p className="mt-5 leading-relaxed text-muted-foreground">
                  For enrolment enquiries or questions about the programme, reach us on WhatsApp or
                  by email. Enrolment is handled by the school administration.
                </p>
                <SocialLinks className="mt-8" />
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href={phoneHref}
                  className="group flex items-center gap-4 rounded-lg border border-border px-5 py-5 transition-colors duration-200 hover:border-amber/70 hover:bg-secondary"
                >
                  <Phone className="size-5 shrink-0 text-amber" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-headline">
                      Call the school
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {contact.phoneNumber}
                    </span>
                  </span>
                </a>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-4 rounded-lg border border-amber/50 bg-amber/10 px-5 py-5 transition-colors duration-200 hover:border-amber hover:bg-amber/20"
                >
                  <MessageCircle className="size-5 shrink-0 text-amber" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-headline">
                      Chat on WhatsApp
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {contact.whatsappNumber}
                    </span>
                  </span>
                </a>

                <a
                  href={emailHref}
                  className="group flex items-center gap-4 rounded-lg border border-border px-5 py-5 transition-colors duration-200 hover:border-amber/70 hover:bg-secondary"
                >
                  <Mail className="size-5 shrink-0 text-amber" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-headline">Send an email</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {contact.email}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
