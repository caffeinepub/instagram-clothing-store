# Instagram Clothing Store

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Product data model: id, name, price, description, category, imageUrl, createdAt
- Backend CRUD: addProduct, updateProduct, deleteProduct, getProducts, getProductsByCategory
- Shopping cart: client-side cart state (add, remove, update quantity)
- Category filter: tops, bottoms, dresses, accessories, shoes
- Admin panel (password-protected): add/edit/delete products
- Instagram-style product grid feed
- Product detail modal/drawer
- Checkout summary view
- Sample seed products

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Generate Motoko backend with product CRUD and category filtering
2. Build React frontend:
   - Public store: grid feed, category tabs, product cards, cart drawer
   - Admin panel: product management table with add/edit/delete forms
   - Cart: slide-in drawer with quantity controls and order summary
   - Mobile-first responsive layout
