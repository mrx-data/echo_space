-- Migration: Add font_family and font_size columns to articles table
-- Run this in the Supabase SQL editor

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS font_family text NULL
CHECK (font_family IN ('sans', 'serif', 'mono'));

ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS font_size text NULL
CHECK (font_size IN ('sm', 'base', 'lg'));
