import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Admin password would be retrieved from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { 
      title,
      description,
      category,
      tags,
      fileId,
      gallery,
      attributes,
      price,
      password
    } = data;

    // Validate required fields
    if (!title || !password) {
      return NextResponse.json({ error: 'Missing required fields (title and password are required)' }, { status: 400 });
    }
    
    // Check admin password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid admin password' }, { status: 401 });
    }
    
    // Connect to MongoDB
    await client.connect();
    const database = client.db('sitedeals');
    const products = database.collection('products');
    
    // Prepare product document, only include non-empty arrays or objects
    const now = new Date().toISOString();
    const product = {
      name: title,
      description: description || '',
      category: category || '',
      tags: tags && Array.isArray(tags) && tags.length > 0 ? tags : undefined,
      fileId: fileId || '',
      gallery: gallery && Array.isArray(gallery) && gallery.length > 0 ? gallery : undefined,
      attributes: attributes && typeof attributes === 'object' && Object.keys(attributes).length > 0 ? attributes : undefined,
      price: price && !isNaN(parseFloat(price)) ? parseFloat(price) : undefined, // Handle price as optional
      createdAt: now,
      updatedAt: now,
      rating: 4,
      numReviews: 0,
      isActive: true
    };
    
    // Insert the product into MongoDB
    const result = await products.insertOne(product);
    
    return NextResponse.json({ 
      success: true,
      productId: result.insertedId.toString(),
      message: "Product added successfully to MongoDB collection 'products'"
    });
    
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ 
      error: 'Failed to add product', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}