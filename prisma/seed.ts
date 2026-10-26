import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "awmalzhar@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ahmedwaled007";
  if (!process.env.ADMIN_PASSWORD) {
    console.warn("⚠️ [SEED] ADMIN_PASSWORD unset; using default: ahmedwaled007");
  }
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      name: "مدير المتجر",
      role: "superadmin",
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: "مدير المتجر",
      role: "superadmin",
    },
  });
  console.log(`Admin user seeded: ${adminEmail}`);

  // 2. Egyptian Governorates & Delivery Fees map
  const governorateFees = JSON.stringify({
    "القاهرة": 50,
    "الجيزة": 50,
    "الإسكندرية": 65,
    "القليوبية": 60,
    "الشرقية": 70,
    "الدقهلية": 70,
    "الغربية": 70,
    "المنوفية": 70,
    "دمياط": 75,
    "كفر الشيخ": 75,
    "البحيرة": 75,
    "الإسماعيلية": 75,
    "السويس": 75,
    "بورسعيد": 75,
    "الفيوم": 85,
    "بني سويف": 85,
    "المنيا": 90,
    "أسيوط": 95,
    "سوهاج": 100,
    "قنا": 110,
    "الأقصر": 110,
    "أسوان": 120,
    "البحر الأحمر (الغردقة)": 130,
    "جنوب سيناء (شرم الشيخ)": 130,
    "شمال سيناء": 130,
    "مطروح والساحل الشمالي": 120,
    "الوادي الجديد": 140,
  });

  // 3. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: "default" },
    update: {
      governorateFees,
    },
    create: {
      id: "default",
      storeName: "فيتوريا | VITORIA",
      storeNameEn: "VITORIA LUXURY PARFUMS",
      logoText: "VITORIA",
      tagLine: "دار فيتوريا للعطور الملكية الفاخرة — فخامة تدوم وحضور لا يُنسى",
      announcementBarText: "✨ شحن مجاني لكافة محافظات مصر للطلبات التي تزيد عن 1500 ج.م + عينة فاخرة مع كل طلب",
      showAnnouncementBar: true,
      phone: "01098765432",
      whatsappNumber: "201098765432",
      email: "contact@vitoria.com",
      address: "شارع التسعين الشمالي، التجمع الخامس، القاهرة، مصر",
      facebookUrl: "https://facebook.com",
      instagramUrl: "https://instagram.com",
      tiktokUrl: "https://tiktok.com",
      currency: "ج.م",
      freeShippingThreshold: 1500,
      defaultDeliveryFee: 50,
      governorateFees,
      enableCashOnDelivery: true,
      enableInstapay: true,
      instapayInstructions: "يرجى التحويل إلى عنوان الدفع اللحظي: vitoria@instapay ثم إرسال صورة إشعار التحويل عبر الواتساب لتأكيد الطلب فوراً.",
    },
  });
  console.log("Store settings seeded.");

  // 4. Categories
  const categoriesData = [
    {
      name: "عطور رجالية",
      slug: "mens-perfumes",
      description: "عطور رجالية فاخرة تعكس القوة والهيبة وتترك أثراً فواحاً يدوم طوال اليوم",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
      displayOrder: 1,
    },
    {
      name: "عطور نسائية",
      slug: "womens-perfumes",
      description: "توليفات أنثوية آسرة تجمع بين رقة الزهور النادرة ونفحات الفانيليا والمسك الأبيض",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
      displayOrder: 2,
    },
    {
      name: "عطور للجنسين",
      slug: "unisex-perfumes",
      description: "إبداعات عطرية متناغمة تناسب أصحاب الذوق الرفيع من الجنسين مع لمسات عنبرية وخشبية مذهلة",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop",
      displayOrder: 3,
    },
    {
      name: "عطور النيش الملكية",
      slug: "niche-perfumes",
      description: "إصدارات نادرة وخاصة بتركيز Extrait de Parfum بمكونات نقية وعالية الجودة من أرقى مزارع العطور العالمية",
      image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop",
      displayOrder: 4,
    },
    {
      name: "المجموعات والهدايا",
      slug: "gift-sets",
      description: "بوكسات هدايا فاخرة ومجموعات تجربة تضم أشهر وأرقى إبداعاتنا بتغليف ملكي راقٍ",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
      displayOrder: 5,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log("Categories seeded.");

  // 5. Products
  const products = [
    {
      name: "سلطان العود الملكي | Royal Oud Sultan",
      nameEn: "Royal Oud Sultan",
      slug: "royal-oud-sultan",
      description: "عطر مهيب يجسد الفخامة الشرقية بأبهى صورها. يبدأ بافتتاحية حارة من الهيل والزعفران مع لمسة من البرغموت الإيطالي المنعش، يليه قلب دافئ من خشب الأرز والورد الدمشقي، ثم يستقر على قاعدة ساحرة من العود الكمبودي المعتق والعنبر النقي وجلود توسكان الفاخرة. ثبات يتجاوز 24 ساعة وفوحان يملأ المكان.",
      shortDescription: "مزيج ملكي من العود الكمبودي النقي، العنبر المعتق، والزعفران الملكي",
      price: 1250,
      originalPrice: 1600,
      categorySlug: "mens-perfumes",
      concentration: "Extrait de Parfum (إكستريت دي بارفان)",
      inspiration: "توليفة نيش حصرية خاصة بالدار",
      brandCollection: "المجموعة الملكية الخاصة (Imperial Reserve)",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      stockQuantity: 25,
      lowStockAlert: 5,
      topNotes: "الزعفران الملكي، الهيل الغواتيمالي، البرغموت المنعش",
      heartNotes: "الورد الدمشقي، خشب الأرز الأطلسي، الباتشولي الإندونيسي",
      baseNotes: "العود الكمبودي المعتق، العنبر الرمادي، الجلود الإيطالية، خشب الصندل",
      images: [
        { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 1250, originalPrice: 1600, stock: 15, isDefault: true },
        { size: "100ml", price: 1950, originalPrice: 2450, stock: 10, isDefault: false },
      ],
    },
    {
      name: "روز نوار إكسير | Rose Noire Elixir",
      nameEn: "Rose Noire Elixir",
      slug: "rose-noire-elixir",
      description: "توليفة ساحرة تأسر الحواس تفيض بالأنوثة والجاذبية. يتألق العطر بلمسات من توت العليق الأسود والفلفل الوردي، ليندمج في قلب حالم من الورد التركي وزهر البرتقال، ويرتكز على قاعدة مخملية من الفانيليا المدغشقرية، والمسك الأبيض الحريري، وحبوب التونكا المحمصة.",
      shortDescription: "أنوثة طاغية بنفحات الورد التركي المخملي والفانيليا والمسك الأبيض",
      price: 1100,
      originalPrice: 1450,
      categorySlug: "womens-perfumes",
      concentration: "Eau de Parfum (EDP)",
      inspiration: "مستوحى من أرقى عطور الزهور الشرقية الفرنسية",
      brandCollection: "مجموعة الأنوثة الساحرة (Femme Élégance)",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      stockQuantity: 30,
      lowStockAlert: 4,
      topNotes: "توت العليق الأسود، الفلفل الوردي، المندرين الإيطالي",
      heartNotes: "الورد التركي المخملي، زهر البرتقال الأفريقي، الياسمين الغرّاس",
      baseNotes: "الفانيليا المدغشقرية، المسك الأبيض، حبوب التونكا، أخشاب الكشمير",
      images: [
        { url: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 1100, originalPrice: 1450, stock: 18, isDefault: true },
        { size: "100ml", price: 1750, originalPrice: 2200, stock: 12, isDefault: false },
      ],
    },
    {
      name: "سموكي ليذر | Smoky Leather & Amber",
      nameEn: "Smoky Leather & Amber",
      slug: "smoky-leather-amber",
      description: "عطر للجنسين بامتياز، يجمع بين حدة الجلود المدخنة ونعومة العنبر البلسمي. عطر شتوي بامتياز يلفت الأنظار ويمنحك هالة لا تقاوم من الثقة والغموض الراقي.",
      shortDescription: "تناغم استثنائي بين الجلود المدخنة الفاخرة والعنبر البلسمي واللبان العربي",
      price: 1350,
      originalPrice: 1750,
      categorySlug: "unisex-perfumes",
      concentration: "Eau de Parfum (EDP)",
      inspiration: "توليفة نيش خاصة",
      brandCollection: "مجموعة الجلود والعنبر (Leather & Gold)",
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      stockQuantity: 18,
      lowStockAlert: 3,
      topNotes: "الزعتر البري، الزعفران، التوت البري",
      heartNotes: "اللبان العماني النقي، الياسمين الليلي، خشب البتولا المدخن",
      baseNotes: "الجلد السويدي المدبوغ، العنبر الأسود، أخشاب الباتشولي",
      images: [
        { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 1350, originalPrice: 1750, stock: 10, isDefault: true },
        { size: "100ml", price: 2100, originalPrice: 2600, stock: 8, isDefault: false },
      ],
    },
    {
      name: "غراند نيش كشمير | Grand Niche Cashmere",
      nameEn: "Grand Niche Cashmere",
      slug: "grand-niche-cashmere",
      description: "تحفة عطرية نيش بتركيز إكستريت فائق النقاوة. يمنحك شعوراً يشبه ارتداء وشاح كشميري فاخر في أمسية خريفية باردة في شوارع باريس. ثبات استثنائي وهدوء فخم.",
      shortDescription: "أرقى لمسات الكشمير وخشب الصندل النادر مع الفانيليا التاهيتية",
      price: 1850,
      originalPrice: 2400,
      categorySlug: "niche-perfumes",
      concentration: "Extrait de Parfum (إكستريت دي بارفان)",
      inspiration: "إصدار محدود ونادر",
      brandCollection: "مجموعة الإصدارات الملكية الخاصة (Haute Parfumerie)",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      stockQuantity: 12,
      lowStockAlert: 2,
      topNotes: "الهيل الأخضر، زهر الليمون الصقلي، جوزة الطيب",
      heartNotes: "خشب الكشمير فائق النعومة، السوسن الفلورنسي، زهور الهيليوتروب",
      baseNotes: "خشب الصندل الأسترالي، المسك الكريستالي، الفانيليا التاهيتية",
      images: [
        { url: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 1850, originalPrice: 2400, stock: 8, isDefault: true },
        { size: "100ml", price: 2900, originalPrice: 3600, stock: 4, isDefault: false },
      ],
    },
    {
      name: "فيلفت توباكو & بوربون | Velvet Tobacco & Bourbon",
      nameEn: "Velvet Tobacco & Bourbon",
      slug: "velvet-tobacco-bourbon",
      description: "عطر رجالي راقٍ يمزج بين أوراق التبغ الكوبية المنقوعة في البوربون، وحلاوة العسل الجبلي مع نفحات التوابل الدافئة وفول التونكا وخشب الأرز.",
      shortDescription: "أوراق التبغ الكوبي الفاخر، العسل الجبلي، ونفحات التونكا وخشب الأرز",
      price: 1200,
      originalPrice: 1550,
      categorySlug: "mens-perfumes",
      concentration: "Eau de Parfum (EDP)",
      inspiration: "مستوحى من كلاسيكيات التبغ الدافئة الفخمة",
      brandCollection: "مجموعة التبغ والأخشاب (The Gentlemen Club)",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      stockQuantity: 20,
      lowStockAlert: 4,
      topNotes: "أوراق التبغ، الزنجبيل الحار، القرنفل العطري",
      heartNotes: "العسل الجبلي، الكاكاو الغني، حبوب التونكا، الفانيليا",
      baseNotes: "الفواكه المجففة، خشب الأرز، الراتنجات العطرية النادرة",
      images: [
        { url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 1200, originalPrice: 1550, stock: 12, isDefault: true },
        { size: "100ml", price: 1850, originalPrice: 2300, stock: 8, isDefault: false },
      ],
    },
    {
      name: "بيور مسك بلانش | Pure Musk Blanche",
      nameEn: "Pure Musk Blanche",
      slug: "pure-musk-blanche",
      description: "عطر النقاء والجاذبية الهادئة. يعكس إحساس النظافة الفائقة ورائحة القطن الأبيض النقي الممزوج بزهور الفاوانيا البيضاء وزنبق الوادي والمسك الصافي.",
      shortDescription: "قمة النقاء والانتعاش بنفحات المسك الأبيض والفاوانيا وزهور القطن",
      price: 950,
      originalPrice: 1250,
      categorySlug: "womens-perfumes",
      concentration: "Eau de Parfum (EDP)",
      inspiration: "توليفة ناعمة للنقاء اليومي الفاخر",
      brandCollection: "مجموعة النقاء الأبيض (Pure White Edition)",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: true,
      stockQuantity: 22,
      lowStockAlert: 5,
      topNotes: "الألدهيدات النقية، الفلفل الأبيض، البرغموت",
      heartNotes: "الفاوانيا البيضاء، زنبق الوادي، الورد الأبيض السويسري",
      baseNotes: "المسك الأبيض الحريري، خشب الصندل، أخشاب الأرز الشقراء",
      images: [
        { url: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "50ml", price: 950, originalPrice: 1250, stock: 14, isDefault: true },
        { size: "100ml", price: 1500, originalPrice: 1950, stock: 8, isDefault: false },
      ],
    },
    {
      name: "صندوق أسرار الشرق الفاخر | Imperial Discovery Set",
      nameEn: "Imperial Discovery Set",
      slug: "imperial-discovery-set",
      description: "مجموعة استكشاف ملكية تحتوي على 5 زجاجات مصغرة بحجم 15 مل لأشهر عطورنا الأكثر مبيعاً، في علبة هدية فاخرة مبطنة بالمخمل الأسود ومختومة بالشمع الذهبي.",
      shortDescription: "بوكس هدايا فاخر يحتوي على 5 من أشهر عطور الدار بحجم 15 مل",
      price: 1450,
      originalPrice: 1900,
      categorySlug: "gift-sets",
      concentration: "Discovery Collection (15ml x 5)",
      inspiration: "مجموعة هدايا حصرية",
      brandCollection: "مجموعة الهدايا الاستثنائية (Luxury Gift Box)",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      stockQuantity: 15,
      lowStockAlert: 3,
      topNotes: "توليفة منوعه لأفضل المقدمات المنعشة والحارة",
      heartNotes: "أرقى خلاصات الزهور والأخشاب الفاخرة",
      baseNotes: "قواعد أصيلة من العود والمسك والعنبر النقي",
      images: [
        { url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1000&auto=format&fit=crop", isPrimary: false, order: 1 },
      ],
      sizes: [
        { size: "5x15ml", price: 1450, originalPrice: 1900, stock: 15, isDefault: true },
      ],
    },
  ];

  for (const prod of products) {
    const { images, sizes, categorySlug, ...prodData } = prod;
    const categoryId = categoryMap[categorySlug];

    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...prodData,
        categoryId,
      },
      create: {
        ...prodData,
        categoryId,
      },
    });

    // Delete existing images & sizes then recreate
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: img.url,
          isPrimary: img.isPrimary,
          order: img.order,
        },
      });
    }

    await prisma.productSize.deleteMany({ where: { productId: createdProduct.id } });
    for (const sz of sizes) {
      await prisma.productSize.create({
        data: {
          productId: createdProduct.id,
          size: sz.size,
          price: sz.price,
          originalPrice: sz.originalPrice,
          stock: sz.stock,
          isDefault: sz.isDefault,
        },
      });
    }
  }
  console.log("Products seeded successfully.");

  // 6. Coupons
  const coupons = [
    {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 500,
      maxUsageCount: 1000,
      usedCount: 14,
      isActive: true,
    },
    {
      code: "LUXURY100",
      discountType: "FIXED",
      discountValue: 100,
      minOrderValue: 1000,
      maxUsageCount: 500,
      usedCount: 28,
      isActive: true,
    },
    {
      code: "ROYAL20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 2000,
      maxUsageCount: 200,
      usedCount: 5,
      isActive: true,
    },
  ];

  for (const coup of coupons) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: coup,
      create: coup,
    });
  }
  console.log("Coupons seeded.");

  // 7. Seed 2 Sample Orders so Admin Dashboard has live metrics and order management right away
  const sampleProduct = await prisma.product.findFirst({
    where: { slug: "royal-oud-sultan" },
  });

  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: "ORD-2025-1001" },
  });

  if (!existingOrder && sampleProduct) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "ORD-2025-1001",
        customerName: "أحمد محمود النجار",
        customerPhone: "01019283746",
        customerEmail: "ahmed.naggar@gmail.com",
        governorate: "القاهرة",
        city: "التجمع الخامس",
        address: "حي الياسمين، فيلا 24، الدور الثاني",
        landmark: "بجوار مسجد الرحمة وسوبرماركت سعودي",
        notes: "يرجى الاتصال قبل الوصول بنصف ساعة",
        subtotal: 1250,
        deliveryFee: 50,
        discountAmount: 0,
        total: 1300,
        status: "CONFIRMED",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        internalNotes: "تم تأكيد العنوان هاتفياً والعميل بانتظار الشحنة غداً",
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productName: sampleProduct.name,
              productImage: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop",
              selectedSize: "50ml",
              unitPrice: 1250,
              quantity: 1,
              totalPrice: 1250,
            },
          ],
        },
        statusHistory: {
          create: [
            { status: "NEW", comment: "تم استلام الطلب من المتجر الإلكتروني" },
            { status: "CONFIRMED", comment: "تم تأكيد الطلب مع العميل هاتفياً" },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        orderNumber: "ORD-2025-1002",
        customerName: "سارة عبد الرحمن الشريف",
        customerPhone: "01123456789",
        customerEmail: "sara.elsharif@outlook.com",
        governorate: "الإسكندرية",
        city: "سموحة",
        address: "أبراج الصفوة، برج ب، شقة 702",
        landmark: "أمام نادي سموحة الرياضي بوابة 3",
        notes: "الدفع كاش عند الاستلام برجاء توفير فكة",
        subtotal: 2050,
        deliveryFee: 0, // free shipping threshold met
        discountAmount: 100, // coupon LUXURY100
        couponCode: "LUXURY100",
        total: 1950,
        status: "NEW",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        internalNotes: "طلب جديد بحاجة للتأكيد هاتفياً",
        items: {
          create: [
            {
              productName: "روز نوار إكسير | Rose Noire Elixir",
              productImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
              selectedSize: "50ml",
              unitPrice: 1100,
              quantity: 1,
              totalPrice: 1100,
            },
            {
              productName: "بيور مسك بلانش | Pure Musk Blanche",
              productImage: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
              selectedSize: "50ml",
              unitPrice: 950,
              quantity: 1,
              totalPrice: 950,
            },
          ],
        },
        statusHistory: {
          create: [
            { status: "NEW", comment: "تم استلام الطلب من الموقع الإلكتروني" },
          ],
        },
      },
    });
    console.log("Sample orders seeded:", order1.orderNumber, order2.orderNumber);
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
