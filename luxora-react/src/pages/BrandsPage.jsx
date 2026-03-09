import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getProducts } from '../utils/storage.js';
import { getBrandMap, slugifyBrand } from '../utils/brands.js';

export default function BrandsPage() {
  const products = useMemo(() => getProducts() || [], []);
  const brands = useMemo(
    () => Array.from(getBrandMap(products).values()).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  return (
    <main>
      <div className="container brand-store-page">
        <div className="breadcrumb product-breadcrumb">
          <div className="product-breadcrumb-list">
            <div className="product-breadcrumb-item">
              <Link to="/">Home</Link>
              <span className="product-breadcrumb-separator">&gt;</span>
            </div>
            <div className="product-breadcrumb-item current">
              <span>Brand Stores</span>
            </div>
          </div>
        </div>

        <h1 className="brand-store-title">Brand Stores</h1>
        <div className="brand-list-grid">
          {brands.map((brand) => (
            <Link key={brand} to={`/brand/${slugifyBrand(brand)}`} className="brand-list-card">
              <h3>{brand}</h3>
              <p>Visit {brand} store</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
