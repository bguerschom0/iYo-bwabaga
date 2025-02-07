import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async ({ email, password, ...metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },

  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },
};

// Database helper functions
export const db = {
  // Products
  products: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },

    create: async (product) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      return { error };
    },
  },

  // Orders
  orders: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(full_name, email),
          order_items(
            quantity,
            price,
            product:products(name)
          )
        `)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(full_name, email),
          order_items(
            quantity,
            price,
            product:products(*)
          )
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },

    create: async (order) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      return { data, error };
    },

    updateStatus: async (id, status) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  // Customers
  customers: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          orders(count),
          total_spent:orders(total)
        `);
      return { data, error };
    },

    getById: async (id) => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          orders(
            *,
            order_items(
              quantity,
              price,
              product:products(name)
            )
          )
        `)
        .eq('id', id)
        .single();
      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  // Storage helper functions
    storage: {
    uploadProductImage: async (file, productId) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}.${fileExt}`;
      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { upsert: true });
      
      if (error) return { error };

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return { publicUrl };
    },

    uploadAvatar: async (file, userId) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (error) return { error };

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return { publicUrl };
    },

    deleteProductImage: async (fileName) => {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);
      return { error };
    },
  },

  // Analytics helper functions
  analytics: {
    getSalesData: async (timeRange) => {
      const date = new Date();
      switch (timeRange) {
        case 'week':
          date.setDate(date.getDate() - 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total')
        .eq('status', 'completed')
        .gte('created_at', date.toISOString());

      return { data, error };
    },

    getCustomerStats: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, last_order_date');

      return { data, error };
    },

    getCategoryDistribution: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category, price');

      return { data, error };
    },
  },

  // Wishlist functions
  wishlist: {
    getItems: async (userId) => {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId);

      return { data, error };
    },

    addItem: async (userId, productId) => {
      const { data, error } = await supabase
        .from('wishlist')
        .insert({ user_id: userId, product_id: productId })
        .select()
        .single();

      return { data, error };
    },

    removeItem: async (userId, productId) => {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .match({ user_id: userId, product_id: productId });

      return { error };
    },
  },

  // Cart functions
  cart: {
    getItems: async (userId) => {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', userId);

      return { data, error };
    },

    addItem: async (userId, productId, quantity = 1) => {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .match({ user_id: userId, product_id: productId })
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { data, error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .match({ user_id: userId, product_id: productId })
          .select()
          .single();

        return { data, error };
      }

      // Add new item if it doesn't exist
      const { data, error } = await supabase
        .from('cart')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select()
        .single();

      return { data, error };
    },

    updateQuantity: async (userId, productId, quantity) => {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity })
        .match({ user_id: userId, product_id: productId })
        .select()
        .single();

      return { data, error };
    },

    removeItem: async (userId, productId) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .match({ user_id: userId, product_id: productId });

      return { error };
    },

    clearCart: async (userId) => {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      return { error };
    },
  },
};

export default { supabase, auth, db };
