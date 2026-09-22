# Perfume Store

Static HTML/CSS/JavaScript storefront prepared for Vercel deployment.

## Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New Project** and import the repository.
3. Leave the framework preset as **Other**.
4. Leave the build command empty.
5. Use the repository root as the output directory.
6. Deploy.

The site uses the public Supabase anon key and a Cloudinary unsigned upload preset in `supabase-config.js`. Never add Supabase secret/service-role keys or the Cloudinary API secret to this repository.

Before production, replace the prototype public insert/delete Supabase policies with authenticated admin policies.
