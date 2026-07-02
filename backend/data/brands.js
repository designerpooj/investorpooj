// Hand-curated brand -> public company mapping.
// This is the dataset that makes "browse by brand instead of ticker" possible.
// No API provides this mapping, so it has to be built up manually over time.
// Add to this list as you journal about new brands.

const brands = [
  {
    brand: "Lululemon",
    aliases: ["lulu", "lululemon athletica"],
    company: "Lululemon Athletica Inc.",
    ticker: "LULU",
    isPublic: true
  },
  {
    brand: "CeraVe",
    aliases: ["cerave"],
    company: "L'Oreal S.A.",
    ticker: "OR.PA", // Euronext Paris - Finnhub free tier covers this differently, see README
    isPublic: true
  },
  {
    brand: "Stanley",
    aliases: ["stanley cup", "stanley quencher", "stanley tumbler"],
    company: "Pacific Market International",
    ticker: null,
    isPublic: false
  },
  {
    brand: "Glossier",
    aliases: ["glossier"],
    company: "Glossier, Inc.",
    ticker: null,
    isPublic: false
  },
  {
    brand: "Nike",
    aliases: ["nike", "jordan", "air jordan"],
    company: "Nike, Inc.",
    ticker: "NKE",
    isPublic: true
  },
  {
    brand: "Ulta",
    aliases: ["ulta", "ulta beauty"],
    company: "Ulta Beauty, Inc.",
    ticker: "ULTA",
    isPublic: true
  },
  {
    brand: "Target",
    aliases: ["target"],
    company: "Target Corporation",
    ticker: "TGT",
    isPublic: true
  },
  {
    brand: "e.l.f.",
    aliases: ["elf cosmetics", "elf beauty"],
    company: "e.l.f. Beauty, Inc.",
    ticker: "ELF",
    isPublic: true
  }
];

export default brands;
