import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const menuData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('menuItems').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...menuData,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('menuItems').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
