import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  origin: string;
  category: string;
  age?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  description: string;
  story: string;
  featured?: boolean;
  stock?: number;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async (): Promise<Product | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async (): Promise<Product[]> => {
      const query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category && category !== "All") {
        query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};
