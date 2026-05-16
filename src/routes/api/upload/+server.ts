import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file || typeof file === 'string' || !file.name) {
            return json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadDir = 'static/uploads/courses';
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        // Create a safe filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = join(uploadDir, filename);
        
        writeFileSync(filePath, buffer);
        
        return json({ url: `/uploads/courses/${filename}` });
    } catch (error) {
        console.error('Upload error:', error);
        return json({ error: 'Upload failed' }, { status: 500 });
    }
};
