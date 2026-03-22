import { Link } from "react-router-dom";

const heroImage =
  "https://maxiumdoors.co.uk/wp-content/uploads/2018/01/Public-Sector.jpg";
const socialHousingImage =
  "https://maxiumdoors.co.uk/wp-content/uploads/2018/01/IMG_20160304_151412.jpg";
const constructionImage =
  "https://maxiumdoors.co.uk/wp-content/uploads/2018/01/Construction-1.jpg";
const facilitiesImage =
  "https://maxiumdoors.co.uk/wp-content/uploads/2015/01/Facities.jpg";

const productCategories = [
  {
    title: "Louvre Doors",
    strap: "Most popular",
    description:
      "Steel and aluminium louvre doors for plant rooms, boiler rooms and utility spaces, with fire rated and security-led options.",
    image: facilitiesImage,
    href: "/shop",
  },
  {
    title: "Entrance Doors",
    strap: "Robust & secure",
    description:
      "Commercial entrance doors for communal areas, apartment buildings, schools and other high-traffic environments.",
    image: heroImage,
    href: "/shop",
  },
  {
    title: "Aluminium Doors",
    strap: "Made to measure",
    description:
      "UK-designed aluminium door systems for retail, commercial and education settings, with automation and glazing options.",
    image: constructionImage,
    href: "/shop",
  },
];

const byLocationCards = [
  {
    title: "Bin Store Doors",
    description:
      "Purpose-built robust and secure doors, custom-built in the UK with locking, colour, threshold, stay and handing options.",
    image: socialHousingImage,
  },
  {
    title: "Plant Room Doors",
    description:
      "Louvred and specialist steel doors with thresholds, locking options, RAL colours and anti-vandal options for service spaces.",
    image: facilitiesImage,
  },
  {
    title: "School Entrance Doors",
    description:
      "Secure entrance solutions for schools and education buildings, with automation-ready options for constant daily use.",
    image: heroImage,
  },
];

const sectorCards = [
  {
    title: "Doors for public sector buildings",
    body:
      "Supply-only or supply-and-install packages for education, healthcare, transport and other public-facing projects.",
    image: heroImage,
  },
  {
    title: "Doors for social housing",
    body:
      "Communal entrance, louvre and security-focused products developed for social housing blocks and shared-access environments.",
    image: socialHousingImage,
  },
  {
    title: "Doors for building & construction",
    body:
      "Made-to-measure doors for contractors, developers and house builders, supported by specification advice and nationwide delivery.",
    image: constructionImage,
  },
  {
    title: "Doors for facilities management",
    body:
      "Reliable replacement and new-build door sets for plant rooms, maintenance programmes and intensive-use commercial sites.",
    image: facilitiesImage,
  },
];

const reasonsSteel = [
  "2mm thick steel frames",
  "1.5mm thick door leaf skins",
  "2mm thick stainless thresholds",
  "Bolted corner junctions",
  "Best value British made doors",
];

const reasonsAluminium = [
  "High performance insulation",
  "PAS24 certified options",
  "Internal & external use",
  "Durable and robust",
  "National delivery",
];

const reasonsInstall = [
  "Supply & installation service",
  "Site surveys included",
  "Experienced fitters",
  "Fully insured",
  "Trusted quality & reliability",
];

const primaryButton =
  "inline-flex items-center justify-center rounded-md bg-[#F47A20] px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#D96510]";

const secondaryButton =
  "inline-flex items-center justify-center rounded-md border border-[#F47A20] px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-[#F47A20] transition hover:bg-[#F47A20] hover:text-white";

export default function HomePage() {
  return (
    <>
      <section className="bg-[#111111] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F8B78A]">
              Your trusted partner
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Steel &amp; aluminium doors for access, security and durability.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              British-made door systems for commercial, industrial, residential
              and public-sector projects, with supply-only or supply-and-install
              options nationwide.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/85">
              <span className="rounded-full border border-white/20 px-4 py-2">
                Steel Doors
              </span>
              <span className="rounded-full border border-white/20 px-4 py-2">
                Aluminium Doors &amp; Windows
              </span>
              <span className="rounded-full border border-white/20 px-4 py-2">
                Roller Shutters
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className={primaryButton}>
                View the full product range
              </Link>
              <Link to="/order-online" className={secondaryButton}>
                Start your quote
              </Link>
            </div>

            <dl className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F8B78A]">
                  Service
                </dt>
                <dd className="mt-2 text-lg font-semibold">
                  Supply only or install
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F8B78A]">
                  Delivery
                </dt>
                <dd className="mt-2 text-lg font-semibold">
                  Nationwide coverage
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[#F8B78A]">
                  Experience
                </dt>
                <dd className="mt-2 text-lg font-semibold">
                  25+ years in construction
                </dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30">
            <img
              src={heroImage}
              alt="Commercial entrance doors"
              className="h-[460px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#FFF9F4]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#111111] sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="rounded-2xl border border-[#F47A20]/20 bg-white px-5 py-4">
            British made products
          </div>
          <div className="rounded-2xl border border-[#F47A20]/20 bg-white px-5 py-4">
            Made to measure sizing
          </div>
          <div className="rounded-2xl border border-[#F47A20]/20 bg-white px-5 py-4">
            Wide hardware options
          </div>
          <div className="rounded-2xl border border-[#F47A20]/20 bg-white px-5 py-4">
            Fast national delivery
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F47A20]">
            British made steel & aluminium doors
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#111111] sm:text-4xl">
            High quality internal and external doors, made to measure.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#4B4F4C]">
            Wide hardware options, fast and reliable nationwide delivery, and
            durable construction built around commercial and industrial use.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {productCategories.map((category) => (
            <article
              key={category.title}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={category.image}
                alt={category.title}
                className="h-60 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F47A20]">
                  {category.strap}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-[#111111]">
                  {category.title}
                </h3>
                <p className="mt-4 min-h-[96px] text-sm leading-6 text-[#4B4F4C]">
                  {category.description}
                </p>
                <Link to={category.href} className={`${primaryButton} mt-6 w-full`}>
                  View the full product range
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] py-14 text-white sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F8B78A]">
              From design & supply to installation & support
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Door systems for commercial, industrial and retail environments.
            </h2>
            <ul className="mt-8 space-y-3">
              {[
                "Steel doors for commercial and industrial applications",
                "Aluminium doors for retail and commercial premises",
                "Roller shutter and sectional doors for industrial use",
                "Automatic doors for retail and commercial spaces",
                "Supply only, or supply and installation",
                "Maintenance, servicing and repairs for all door types",
                "Nationwide service",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-white/85"
                >
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#F47A20]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/contact" className={`${primaryButton} mt-8`}>
              Request a quote
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F8B78A]">
                Steel doors
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {reasonsSteel.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F8B78A]">
                Aluminium doors
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {reasonsAluminium.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#F8B78A]">
                Installation & automation
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-white/80">
                {reasonsInstall.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F47A20]">
            Popular doors by location
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#111111] sm:text-4xl">
            Door solutions for service areas, schools and shared buildings.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {byLocationCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm"
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#111111]">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-[#4B4F4C]">
                  {card.description}
                </p>
                <Link to="/shop" className={`${secondaryButton} mt-6`}>
                  Find out more
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#FFF9F4] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F47A20]">
              Experience counts
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#111111] sm:text-4xl">
              Trusted technical guidance across steel and aluminium door ranges.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#4B4F4C]">
              With over 25 years of construction experience, the focus is on
              helping customers choose compliant, durable and practical door
              solutions for each project type.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {sectorCards.map((card) => (
              <article
                key={card.title}
                className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#111111]">
                    {card.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[#4B4F4C]">
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F47A20]">
              Get in touch
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#111111]">
              Need help with specification, pricing or a bespoke door set?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#4B4F4C]">
              Contact the team for complex supply and installation requirements,
              or use the online order flow for a quicker quotation route.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/order-online" className={primaryButton}>
              Start your quote
            </Link>
            <Link to="/contact" className={secondaryButton}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}