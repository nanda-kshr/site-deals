import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get BOT_TOKEN from environment variables for security
const BOT_TOKEN = process.env.BOT_TOKEN;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const fileId = body.file_id;
        // Validate required parameters
        if (!fileId) {
            return NextResponse.json({ error: 'Missing file_id in request body' }, { status: 400 });
        }
        
        if (!BOT_TOKEN) {
            console.error('BOT_TOKEN environment variable is not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Get file path from Telegram
        const { data: fileInfo } = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );
        
        if (!fileInfo?.result?.file_path) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }
        
        const filePath = fileInfo.result.file_path;

        // Get actual file
        const imageUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Return the image with proper content type
        return new NextResponse(imageResponse.data, {
            headers: {
                'Content-Type': imageResponse.headers['content-type'] || 'image/jpeg',
            }
        });
    } catch (error) {
        // Log the error for debugging, but don't expose details to client
        console.error('Error fetching file:', error);
        
        return NextResponse.json(
            { error: 'Failed to fetch file' },
            { status: 500 }
        );
    }
}