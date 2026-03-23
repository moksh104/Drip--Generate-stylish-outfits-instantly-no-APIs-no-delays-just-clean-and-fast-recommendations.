import { NextRequest, NextResponse } from 'next/server';

const SHIRTS = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=512&q=80',
  'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=512&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=512&q=80',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=512&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=512&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=512&q=80',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=512&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=512&q=80',
];
const PANTS = [
  'https://images.unsplash.com/photo-1542272604-787c3835535d?w=512&q=80',
  'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=512&q=80',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=512&q=80',
  'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=512&q=80',
  'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=512&q=80',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=512&q=80',
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=512&q=80',
  'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=512&q=80',
];
const SHOES = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=512&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=512&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=512&q=80',
  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=512&q=80',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=512&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=512&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=512&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=512&q=80',
];
const WATCHES = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=512&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=512&q=80',
  'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=512&q=80',
  'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=512&q=80',
  'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=512&q=80',
  'https://images.unsplash.com/photo-1619134778706-7015533a6150?w=512&q=80',
  'https://images.unsplash.com/photo-1600717707958-b1eef3bed82e?w=512&q=80',
  'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=512&q=80',
];
const ACCESSORIES = [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=512&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=512&q=80',
  'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=512&q=80',
  'https://images.unsplash.com/photo-1609942072337-c3370e820005?w=512&q=80',
  'https://images.unsplash.com/photo-1625891813682-b8c5e7b7e63c?w=512&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=512&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=512&q=80',
  'https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=512&q=80',
];
const WOMEN_TOPS = [
  'https://images.unsplash.com/photo-1551163943-3f7fb896e0ce?w=512&q=80',
  'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=512&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=512&q=80',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=512&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=512&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=512&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=512&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=512&q=80',
];
const WOMEN_BOTTOMS = [
  'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=512&q=80',
  'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=512&q=80',
  'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=512&q=80',
  'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=512&q=80',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=512&q=80',
  'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=512&q=80',
  'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=512&q=80',
  'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=512&q=80',
];
const WOMEN_SHOES = [
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=512&q=80',
  'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=512&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=512&q=80',
  'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=512&q=80',
  'https://images.unsplash.com/photo-1536916216638-e2a5b871a72a?w=512&q=80',
  'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=512&q=80',
  'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=512&q=80',
  'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=512&q=80',
];
const WOMEN_BAGS = [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=512&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=512&q=80',
  'https://images.unsplash.com/photo-1566150905458-1bf1a9e1b8a4?w=512&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=512&q=80',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=512&q=80',
  'https://images.unsplash.com/photo-1614179924047-e1ab49a0a0cf?w=512&q=80',
  'https://images.unsplash.com/photo-1601924351433-3d7d2f44a1e2?w=512&q=80',
  'https://images.unsplash.com/photo-1519923041107-5d2cc8f1db71?w=512&q=80',
];
const WOMEN_JEWELRY = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=512&q=80',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=512&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=512&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=512&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94815b0?w=512&q=80',
  'https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?w=512&q=80',
  'https://images.unsplash.com/photo-1574170609306-b5c2baec5f73?w=512&q=80',
  'https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=512&q=80',
];
const KIDS_TOPS = [
  'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=512&q=80',
  'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=512&q=80',
  'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=512&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=512&q=80',
  'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=512&q=80',
  'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=512&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=512&q=80',
  'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=512&q=80',
];
const KIDS_SHOES = [
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=512&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=512&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=512&q=80',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=512&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=512&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=512&q=80',
  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=512&q=80',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=512&q=80',
];

function resolveImageUrl(key: string, variant: number): string {
  const base = key.toLowerCase().replace(/(-v?\d+)$/, '');

  if (base.startsWith('women-')) {
    if (base.includes('shoes') || base.includes('heel') || base.includes('flat') || base.includes('boot') || base.includes('sandal') || base.includes('mule') || base.includes('stiletto') || base.includes('platform') || base.includes('crystal-shoes'))
      return WOMEN_SHOES[variant % WOMEN_SHOES.length];
    if (base.includes('bag') || base.includes('clutch') || base.includes('tote') || base.includes('purse') || base.includes('satchel'))
      return WOMEN_BAGS[variant % WOMEN_BAGS.length];
    if (base.includes('jewelry') || base.includes('necklace') || base.includes('earring') || base.includes('bracelet') || base.includes('ring') || base.includes('pearl') || base.includes('diamond'))
      return WOMEN_JEWELRY[variant % WOMEN_JEWELRY.length];
    if (base.includes('bottom') || base.includes('pant') || base.includes('skirt') || base.includes('legging') || base.includes('tights') || base.includes('short') || base.includes('jean') || base.includes('denim') || base.includes('slip'))
      return WOMEN_BOTTOMS[variant % WOMEN_BOTTOMS.length];
    return WOMEN_TOPS[variant % WOMEN_TOPS.length];
  }

  if (base.startsWith('girl-')) {
    if (base.includes('shoes') || base.includes('sneaker') || base.includes('flat') || base.includes('boot') || base.includes('mary') || base.includes('ballet') || base.includes('glass'))
      return KIDS_SHOES[variant % KIDS_SHOES.length];
    if (base.includes('bag') || base.includes('backpack') || base.includes('clutch'))
      return WOMEN_BAGS[variant % WOMEN_BAGS.length];
    if (base.includes('extras') || base.includes('clip') || base.includes('bow') || base.includes('ribbon') || base.includes('beret') || base.includes('headband') || base.includes('tiara') || base.includes('crown'))
      return KIDS_SHOES[variant % KIDS_SHOES.length];
    if (base.includes('bottom') || base.includes('skirt') || base.includes('pant') || base.includes('legging') || base.includes('tights') || base.includes('short') || base.includes('slip') || base.includes('tulle'))
      return WOMEN_BOTTOMS[variant % WOMEN_BOTTOMS.length];
    return KIDS_TOPS[variant % KIDS_TOPS.length];
  }

  if (base.startsWith('boy-')) {
    if (base.includes('shoes') || base.includes('sneaker') || base.includes('boot') || base.includes('trainer') || base.includes('canvas') || base.includes('loafer') || base.includes('patent'))
      return KIDS_SHOES[variant % KIDS_SHOES.length];
    if (base.includes('cap') || base.includes('hat') || base.includes('bowtie') || base.includes('pocket') || base.includes('belt') || base.includes('chain') || base.includes('wristband') || base.includes('watch') || base.includes('cufflink') || base.includes('buckle'))
      return ACCESSORIES[variant % ACCESSORIES.length];
    if (base.includes('bottom') || base.includes('pant') || base.includes('jean') || base.includes('short') || base.includes('jogger') || base.includes('khaki') || base.includes('cargo'))
      return PANTS[variant % PANTS.length];
    return KIDS_TOPS[variant % KIDS_TOPS.length];
  }

  if (base.startsWith('watch-')) return WATCHES[variant % WATCHES.length];
  if (base.startsWith('acc-')) {
    if (base.includes('backpack') || base.includes('crossbody') || base.includes('tote') || base.includes('mini-bag'))
      return WOMEN_BAGS[variant % WOMEN_BAGS.length];
    return ACCESSORIES[variant % ACCESSORIES.length];
  }
  if (base.startsWith('shoes-')) return SHOES[variant % SHOES.length];
  if (base.startsWith('pants-')) return PANTS[variant % PANTS.length];
  if (base.startsWith('shirt-')) return SHIRTS[variant % SHIRTS.length];

  return SHIRTS[variant % SHIRTS.length];
}
async function generateImage(item: string, variant: number): Promise<ArrayBuffer> {
  const url = resolveImageUrl(item, variant);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const item = searchParams.get("item");
  const variant = searchParams.get("variant") || "0";

  if (!item) return new Response("Item parameter required", { status: 400 });

  const fileName = `${item}-${variant}.png`;
  const filePath = path.join(process.cwd(), "public/outfit-images", fileName);

  // ✅ 1. If already exists → return instantly
  if (fs.existsSync(filePath)) {
    return new Response(fs.readFileSync(filePath), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  }

  try {
    // ✅ 2. If not → generate image
    const imageBuffer = await generateImage(item, parseInt(variant, 10));

    // ✅ 3. Save for future (cache)
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(filePath, Buffer.from(imageBuffer));

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable"
      },
    });
  } catch (error) {
    console.error("Failed to generate image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body as { items: string[] };
    if (!items || !Array.isArray(items))
      return new Response(JSON.stringify({ error: 'Items array required' }), { status: 400 });
      
    const results: Record<string, string> = {};
    items.forEach((item, idx) => {
      // Just return the new local URL mapping pattern
      results[item] = `/api/outfits/images?item=${item}&variant=${idx}`;
    });
    return new Response(JSON.stringify({ images: results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to resolve images' }), { status: 500 });
  }
}
