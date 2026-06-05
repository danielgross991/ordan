/**
 * Seed script — populates the Neon Postgres database with initial categories,
 * regions, and sample suppliers.
 *
 * Usage: npm run seed
 * Requires: DATABASE_URL in .env.local
 */

import { join } from 'path'
import { neon } from '@neondatabase/serverless'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('❌  DATABASE_URL is not set in .env.local')
  process.exit(1)
}

const sql = neon(url)

async function seedCategories() {
  console.log('📂 Seeding categories...')

  const categories = [
    { slug: 'mazon', label: 'מזון', icon: '🥗', order: 1 },
    { slug: 'yerakot-perot', label: 'ירקות ופירות', icon: '🥦', order: 2 },
    { slug: 'basar-dagim', label: 'בשר ודגים', icon: '🥩', order: 3 },
    { slug: 'had-pa-ariza', label: 'חד״פ ואריזות', icon: '📦', order: 4 },
    { slug: 'tziyud-mitbach', label: 'ציוד מטבח', icon: '🍳', order: 5 },
    { slug: 'nikui', label: 'ניקיון', icon: '🧹', order: 6 },
    { slug: 'shrutim-asaim', label: 'שירותים לעסקים', icon: '💼', order: 7 },
  ]

  for (const c of categories) {
    await sql`
      INSERT INTO categories (id, slug, label_he, icon, sort_order, active)
      VALUES (${uuidv4()}, ${c.slug}, ${c.label}, ${c.icon}, ${c.order}, true)
      ON CONFLICT (slug) DO NOTHING
    `
  }
  console.log(`  ✅ ${categories.length} categories seeded`)
}

async function seedRegions() {
  console.log('📍 Seeding regions...')

  const regions = [
    { slug: 'tsafon', label: 'צפון', order: 1 },
    { slug: 'haifa-kriot', label: 'חיפה והקריות', order: 2 },
    { slug: 'sharon', label: 'השרון', order: 3 },
    { slug: 'merkaz', label: 'מרכז', order: 4 },
    { slug: 'tel-aviv', label: 'תל אביב וגוש דן', order: 5 },
    { slug: 'yerushalayim', label: 'ירושלים והסביבה', order: 6 },
    { slug: 'shfela', label: 'שפלה', order: 7 },
    { slug: 'darom', label: 'דרום', order: 8 },
    { slug: 'kol-haaretz', label: 'כל הארץ', order: 9 },
  ]

  for (const r of regions) {
    await sql`
      INSERT INTO regions (id, slug, label_he, sort_order, active)
      VALUES (${uuidv4()}, ${r.slug}, ${r.label}, ${r.order}, true)
      ON CONFLICT (slug) DO NOTHING
    `
  }
  console.log(`  ✅ ${regions.length} regions seeded`)
}

async function seedSuppliers() {
  console.log('🏪 Seeding sample suppliers...')

  const now = new Date().toISOString()

  const suppliers = [
    {
      slug: 'tnuva-distribution',
      businessName: 'תנובה הפצה',
      shortDescription: 'ספק מוביל של מוצרי חלב, ביצים, ומוצרי מזון לעסקים מכל הסקטורים.',
      fullDescription: 'תנובה הפצה מספקת מגוון רחב של מוצרי חלב, גבינות, ביצים, ומוצרי קירור לעסקי מזון ואירוח ברחבי הארץ.',
      primaryCategory: 'מזון',
      subcategories: ['חלב', 'גבינות', 'ביצים'],
      supplierType: 'מפיץ',
      businessFit: ['מסעדות', 'בתי קפה', 'בתי מלון', 'קייטרינג'],
      phone: '03-6000000', whatsapp: '0526000000', email: 'orders@tnuva.co.il',
      website: 'https://www.tnuva.co.il', address: 'רחוב התעשייה 5', city: 'רמלה',
      region: 'מרכז', serviceAreas: ['מרכז', 'תל אביב וגוש דן', 'שפלה'],
      openingHours: 'א׳-ה׳ 7:00–17:00 | ו׳ 7:00–13:00',
      keywords: ['חלב', 'גבינה', 'ביצים', 'חלביים', 'קירור'],
      featured: true,
    },
    {
      slug: 'shamir-salads',
      businessName: 'שמיר ירקות ופירות',
      shortDescription: 'ספק ירקות ופירות טריים לעסקי מסעדנות — הגבעה מגיעה אליכם כל בוקר.',
      fullDescription: 'שמיר ירקות ופירות מתמחה באספקה יומית של ירקות ופירות טריים ישירות מהגינה.',
      primaryCategory: 'ירקות ופירות',
      subcategories: ['ירקות', 'פירות', 'עשבי תיבול'],
      supplierType: 'סיטונאי',
      businessFit: ['מסעדות', 'בתי קפה', 'קייטרינג', 'מטבחים מוסדיים'],
      phone: '04-8500000', whatsapp: '0508500000', email: 'shamir@yarok.co.il',
      website: null, address: 'שוק הסיטונאים', city: 'חיפה',
      region: 'חיפה והקריות', serviceAreas: ['חיפה והקריות', 'צפון', 'השרון'],
      openingHours: 'א׳-ו׳ 4:00–12:00',
      keywords: ['ירקות', 'פירות', 'טרי', 'חקלאי'],
      featured: true,
    },
    {
      slug: 'mega-meat-israel',
      businessName: 'מגה בשר',
      shortDescription: 'קצביה סיטונאית — בשר בקר, כבש, ועוף מובחר לעסקי מסעדנות.',
      fullDescription: 'מגה בשר מספקת בשר טרי ומקורר לעסקים מכל הסוגים. ניתוח לפי הגדרות השף, מסירה עד הדלת.',
      primaryCategory: 'בשר ודגים',
      subcategories: ['בשר בקר', 'עוף', 'כבש'],
      supplierType: 'סיטונאי',
      businessFit: ['מסעדות', 'קייטרינג', 'בתי מלון', 'מטבחים מוסדיים'],
      phone: '03-7200000', whatsapp: '0527200000', email: 'info@megameat.co.il',
      website: 'https://www.megameat.co.il', address: 'אזור תעשייה', city: 'ראשון לציון',
      region: 'תל אביב וגוש דן', serviceAreas: ['תל אביב וגוש דן', 'מרכז', 'שפלה'],
      openingHours: 'א׳-ה׳ 5:00–16:00 | ו׳ 5:00–12:00',
      keywords: ['בשר', 'עוף', 'קצביה', 'בקר'],
      featured: false,
    },
    {
      slug: 'clean-pro-israel',
      businessName: 'קלין פרו',
      shortDescription: 'ציוד וחומרי ניקיון מקצועיים לתעשיית המזון והאירוח.',
      fullDescription: 'קלין פרו מספקת מוצרי ניקיון ותחזוקה לעסקי מזון ואירוח. עמידה בתקנות משרד הבריאות.',
      primaryCategory: 'ניקיון',
      subcategories: ['חומרי חיטוי', 'ציוד ניקיון', 'מוצרי נייר'],
      supplierType: 'מפיץ',
      businessFit: ['מסעדות', 'בתי מלון', 'מטבחים מוסדיים', 'בתי קפה'],
      phone: '08-9000000', whatsapp: '0549000000', email: 'sales@cleanpro.co.il',
      website: null, address: 'רחוב הנגב 12', city: 'באר שבע',
      region: 'דרום', serviceAreas: ['דרום', 'שפלה'],
      openingHours: 'א׳-ה׳ 8:00–17:00',
      keywords: ['ניקיון', 'חיטוי', 'היגיינה'],
      featured: false,
    },
    {
      slug: 'noa-packaging',
      businessName: 'נועה אריזות',
      shortDescription: 'אריזות חד פעמיות, מכלים, וציוד מזון לשדה — לעסקי מסעדנות ואירועים.',
      fullDescription: 'נועה אריזות מתמחה בפתרונות אריזה לתעשיית המזון. פתרונות ידידותיים לסביבה זמינים.',
      primaryCategory: 'חד״פ ואריזות',
      subcategories: ['קופסאות take-away', 'כלים חד פעמיים', 'שקיות'],
      supplierType: 'סיטונאי',
      businessFit: ['מסעדות', 'בתי קפה', 'קייטרינג', 'אירועים'],
      phone: '09-7400000', whatsapp: '0527400000', email: 'orders@noapack.co.il',
      website: 'https://www.noapack.co.il', address: 'רחוב הרצל 80', city: 'נתניה',
      region: 'השרון', serviceAreas: ['השרון', 'תל אביב וגוש דן', 'מרכז'],
      openingHours: 'א׳-ה׳ 8:30–17:30 | ו׳ 8:30–13:00',
      keywords: ['אריזות', 'חד פעמי', 'take away'],
      featured: false,
    },
    {
      slug: 'chef-equipment-solutions',
      businessName: 'ציוד שף',
      shortDescription: 'ציוד מטבח מקצועי — מכשירים חשמליים, כלי בישול, ואחסון לשפים ומסעדות.',
      fullDescription: 'ציוד שף מספקת את כל הציוד הנדרש למטבח מקצועי. ייעוץ מקצועי לתכנון מטבח מסחרי.',
      primaryCategory: 'ציוד מטבח',
      subcategories: ['מכשירים חשמליים', 'כלי בישול', 'אחסון'],
      supplierType: 'מפיץ',
      businessFit: ['מסעדות', 'בתי מלון', 'קייטרינג', 'מאפיות'],
      phone: '03-5500000', whatsapp: '0525500000', email: 'info@chefequip.co.il',
      website: 'https://www.chefequip.co.il', address: 'רחוב הברזל 30', city: 'תל אביב',
      region: 'תל אביב וגוש דן', serviceAreas: ['תל אביב וגוש דן', 'מרכז', 'חיפה והקריות'],
      openingHours: 'א׳-ה׳ 9:00–18:00',
      keywords: ['ציוד מטבח', 'תנור', 'מקפיא'],
      featured: false,
    },
    {
      slug: 'north-fish-supply',
      businessName: 'דגים הצפון',
      shortDescription: 'אספקת דגים טריים ימי כל יום — ישר מהנמל למטבח שלכם.',
      fullDescription: 'דגים הצפון מספקת דגים ופירות ים טריים ישירות מהדייגים לעסקי מסעדנות.',
      primaryCategory: 'בשר ודגים',
      subcategories: ['דגים', 'פירות ים'],
      supplierType: 'ספק שירות',
      businessFit: ['מסעדות', 'בתי מלון', 'קייטרינג'],
      phone: '04-8700000', whatsapp: '0528700000', email: 'fish@north.co.il',
      website: null, address: 'נמל עכו', city: 'עכו',
      region: 'צפון', serviceAreas: ['צפון', 'חיפה והקריות'],
      openingHours: 'א׳-ו׳ 5:00–13:00',
      keywords: ['דגים', 'ים', 'טרי', 'פירות ים'],
      featured: false,
    },
    {
      slug: 'accounting-restaurants',
      businessName: 'חשבית — הנהלת חשבונות למסעדות',
      shortDescription: 'שירותי הנהלת חשבונות ותמיכה עסקית המתמחים בסקטור המסעדנות.',
      fullDescription: 'חשבית מספקת שירותי הנהלת חשבונות, ייעוץ מס, ותמיכה עסקית המותאמים לצרכים הייחודיים של עסקי מזון ואירוח.',
      primaryCategory: 'שירותים לעסקים',
      subcategories: ['הנהלת חשבונות', 'ייעוץ מס'],
      supplierType: 'ספק שירות',
      businessFit: ['מסעדות', 'בתי קפה', 'בתי מלון', 'קייטרינג'],
      phone: '03-6100000', whatsapp: '0526100000', email: 'info@hashavit.co.il',
      website: 'https://www.hashavit.co.il', address: 'רחוב אלנבי 100', city: 'תל אביב',
      region: 'תל אביב וגוש דן', serviceAreas: ['כל הארץ'],
      openingHours: 'א׳-ה׳ 9:00–18:00',
      keywords: ['הנהלת חשבונות', 'מס', 'עסק'],
      featured: false,
    },
    {
      slug: 'bakery-supplies-direct',
      businessName: 'קמח ישיר',
      shortDescription: 'קמח, שמרים, וחומרי גלם למאפיות ולמסעדות — ישירות מהמפעל.',
      fullDescription: 'קמח ישיר מספקת קמח מכל הסוגים, שמרים, שמנים, סוכר, ומלח לעסקי מאפה ומסעדנות.',
      primaryCategory: 'מזון',
      subcategories: ['קמח', 'שמרים', 'שמנים'],
      supplierType: 'יצרן',
      businessFit: ['מאפיות', 'מסעדות', 'בתי קפה', 'מטבחים מוסדיים'],
      phone: '02-5000000', whatsapp: '0525000000', email: 'orders@kamachyashar.co.il',
      website: null, address: 'אזור תעשייה מלחה', city: 'ירושלים',
      region: 'ירושלים והסביבה', serviceAreas: ['ירושלים והסביבה', 'מרכז'],
      openingHours: 'א׳-ה׳ 7:00–16:00 | ו׳ 7:00–12:00',
      keywords: ['קמח', 'שמרים', 'מאפייה', 'אפייה'],
      featured: false,
    },
  ]

  for (const s of suppliers) {
    const id = uuidv4()
    await sql`
      INSERT INTO suppliers (
        id, slug, business_name, short_description, full_description,
        primary_category, subcategories, supplier_type, business_fit,
        phone, whatsapp, email, website, address, city, region,
        service_areas, opening_hours, keywords, status, featured,
        source_type, created_at, updated_at
      ) VALUES (
        ${id}, ${s.slug}, ${s.businessName}, ${s.shortDescription}, ${s.fullDescription},
        ${s.primaryCategory}, ${s.subcategories}, ${s.supplierType}, ${s.businessFit},
        ${s.phone}, ${s.whatsapp}, ${s.email}, ${s.website ?? null},
        ${s.address}, ${s.city}, ${s.region},
        ${s.serviceAreas}, ${s.openingHours}, ${s.keywords},
        'published', ${s.featured},
        'seed', ${now}, ${now}
      )
      ON CONFLICT (slug) DO NOTHING
    `
  }
  console.log(`  ✅ ${suppliers.length} sample suppliers seeded`)
  console.log('  ℹ️  Note: These are sample suppliers for testing. Review and update before going live.')
}

async function main() {
  console.log('\n🌱 Ordan Seed Script\n')
  try {
    await seedCategories()
    await seedRegions()
    await seedSuppliers()
    console.log('\n✅ Seed complete!\n')
  } catch (err) {
    console.error('\n❌ Seed failed:', err)
    process.exit(1)
  }
}

main()
