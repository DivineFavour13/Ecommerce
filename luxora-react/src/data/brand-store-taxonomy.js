import { normalizeBrand } from '../utils/brands.js';

const adidasTaxonomy = {
  productCategories: [
    { label: 'Shoes', keywords: ['shoe', 'sneaker', 'boot', 'trainer', 'cleat'] },
    { label: 'Clothing', keywords: ['shirt', 'hoodie', 'tracksuit', 'jacket', 'pant', 'short', 'tee'] },
    { label: 'Accessories', keywords: ['sock', 'bag', 'hat', 'cap', 'ball', 'eyewear', 'belt'] }
  ],
  audiences: [
    { label: 'Men', keywords: ['men', "men's", 'male'] },
    { label: 'Women', keywords: ['women', "women's", 'female', 'ladies'] },
    { label: 'Kids', keywords: ['kid', 'kids', 'youth', 'child', 'children'] }
  ],
  sports: [
    { label: 'Football', keywords: ['football', 'soccer', 'boot'] },
    { label: 'Running', keywords: ['running', 'runner'] },
    { label: 'Golf', keywords: ['golf'] },
    { label: 'Tennis', keywords: ['tennis'] },
    { label: 'Basketball', keywords: ['basketball'] },
    { label: 'Swimming', keywords: ['swim', 'swimming'] },
    { label: 'Skateboarding', keywords: ['skate', 'skateboard'] }
  ]
};

const samsungTaxonomy = {
  productCategories: [
    { label: 'Phones', keywords: ['galaxy', 'phone', 'smartphone', 'ultra', 'fold', 'flip'] },
    { label: 'Tablets', keywords: ['tab', 'tablet'] },
    { label: 'Wearables', keywords: ['watch', 'fit', 'band', 'wearable'] },
    { label: 'Audio', keywords: ['buds', 'earbud', 'headphone', 'audio'] },
    { label: 'Accessories', keywords: ['case', 'charger', 'cable', 'accessory'] }
  ],
  audiences: [
    { label: 'Men', keywords: ['men', "men's", 'male'] },
    { label: 'Women', keywords: ['women', "women's", 'female', 'ladies'] },
    { label: 'Kids', keywords: ['kid', 'kids', 'youth', 'child', 'children'] }
  ],
  sports: []
};

const appleTaxonomy = {
  productCategories: [
    { label: 'iPhone', keywords: ['iphone'] },
    { label: 'iPad', keywords: ['ipad'] },
    { label: 'Mac', keywords: ['macbook', 'mac'] },
    { label: 'Wearables', keywords: ['apple watch', 'watch', 'airpods'] },
    { label: 'Accessories', keywords: ['mag safe', 'magsafe', 'charger', 'cable', 'case', 'accessory'] }
  ],
  audiences: [
    { label: 'Students', keywords: ['student', 'school'] },
    { label: 'Professionals', keywords: ['pro', 'professional', 'work'] },
    { label: 'Creators', keywords: ['creator', 'video', 'photo', 'design'] }
  ],
  sports: []
};

const nikeTaxonomy = {
  productCategories: [
    { label: 'Shoes', keywords: ['shoe', 'sneaker', 'boot', 'trainer', 'cleat'] },
    { label: 'Clothing', keywords: ['shirt', 'hoodie', 'tracksuit', 'jacket', 'pant', 'short', 'tee'] },
    { label: 'Accessories', keywords: ['sock', 'bag', 'hat', 'cap', 'ball', 'belt'] }
  ],
  audiences: [
    { label: 'Men', keywords: ['men', "men's", 'male'] },
    { label: 'Women', keywords: ['women', "women's", 'female', 'ladies'] },
    { label: 'Kids', keywords: ['kid', 'kids', 'youth', 'child', 'children'] }
  ],
  sports: [
    { label: 'Running', keywords: ['running', 'runner'] },
    { label: 'Football', keywords: ['football', 'soccer'] },
    { label: 'Basketball', keywords: ['basketball'] },
    { label: 'Training', keywords: ['training', 'gym', 'workout'] },
    { label: 'Tennis', keywords: ['tennis'] }
  ]
};

const sonyTaxonomy = {
  productCategories: [
    { label: 'Audio', keywords: ['headphone', 'earbud', 'speaker', 'audio'] },
    { label: 'Gaming', keywords: ['playstation', 'ps5', 'controller', 'gaming'] },
    { label: 'Cameras', keywords: ['camera', 'alpha', 'lens'] },
    { label: 'TV & Home Theater', keywords: ['tv', 'television', 'bravia', 'home theater'] },
    { label: 'Accessories', keywords: ['charger', 'cable', 'case', 'accessory'] }
  ],
  audiences: [
    { label: 'Gamers', keywords: ['gaming', 'gamer', 'playstation', 'ps5'] },
    { label: 'Creators', keywords: ['creator', 'camera', 'video', 'photo'] },
    { label: 'Everyday Users', keywords: ['daily', 'everyday', 'wireless'] }
  ],
  sports: []
};

export const BRAND_STORE_TAXONOMY = {
  adidas: adidasTaxonomy,
  samsung: samsungTaxonomy,
  apple: appleTaxonomy,
  nike: nikeTaxonomy,
  sony: sonyTaxonomy
};

function toKeywordGroup(label) {
  return [{ label, keywords: [String(label || '').toLowerCase()] }];
}

export function getBrandStoreTaxonomy(brandName, brandProducts = []) {
  const key = normalizeBrand(brandName).replace(/\s+/g, '');
  const preset = BRAND_STORE_TAXONOMY[key];
  if (preset) return preset;

  const productCategories = Array.from(
    new Set(brandProducts.map((p) => String(p.category || '').trim()).filter(Boolean))
  ).flatMap((category) => toKeywordGroup(category));

  return {
    productCategories,
    audiences: [],
    sports: []
  };
}
