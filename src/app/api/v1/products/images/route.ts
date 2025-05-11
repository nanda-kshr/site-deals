import { NextResponse } from "next/server";

const isValidImage = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
};

const retryOnRateLimit = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof Error && error.message.includes('429') && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('image') as File[];
    const productId = formData.get("productId") as string;

    if (!files.length || !productId) {
      return NextResponse.json(
        { error: "Product ID and image are required" },
        { status: 400 }
      );
    }

    // Validate image types
    for (const file of files) {
      if (!isValidImage(file)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" },
          { status: 400 }
        );
      }
    }

    const fileIds: { fileId: string; placeholderId?: string }[] = [];

    for (const file of files) {
      const uploadData = new FormData();
      uploadData.append("chatId", process.env.CHAT_ID || "");
      uploadData.append("key", process.env.BOT_TOKEN || "");
      uploadData.append("mongouri", process.env.MONGODB_URI || "");
      uploadData.append("collection", process.env.MONGODB_COLLECTION || "");
      uploadData.append("compress", process.env.COMPRESS || "true");
      uploadData.append("image", file);

      const response = await retryOnRateLimit(() =>
        fetch(String(process.env.UNLIMCLOUD_URL), {
          method: "POST",
          body: uploadData,
        })
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Missing required fields') {
          throw new Error("Ensure all environment variables (CHAT_ID, API_KEY, MONGODB_URI, COLLECTION_NAME) are set correctly");
        }
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      fileIds.push({
        fileId: result.fileIds[0].fileId,
        placeholderId: result.fileIds[0].placeholderId
      });
    }

    return NextResponse.json(
      { message: "Images uploaded successfully", fileIds },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading images:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("Too many uploads") ? 429 : 500;
    return NextResponse.json(
      { 
        error: status === 429 ? "Too many uploads, please try again later" : "Internal Server Error", 
        details: message 
      },
      { status }
    );
  }
}