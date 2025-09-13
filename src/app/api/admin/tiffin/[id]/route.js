import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const tiffinData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('tiffinPlans').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...tiffinData,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Tiffin plan not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tiffin plan updated successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tiffin plan' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection('tiffinPlans').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Tiffin plan not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tiffin plan deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tiffin plan' }, { status: 500 });
  }
}
