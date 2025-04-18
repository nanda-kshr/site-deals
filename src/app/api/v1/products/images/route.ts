import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const image = formData.get("image") as File;

    if (!productId || !image) {
      return NextResponse.json(
        { error: "Product ID and image are required" },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("chatId", process.env.CHAT_ID || "");
    uploadData.append("key", process.env.BOT_TOKEN || "");
    uploadData.append("mongouri", process.env.MONGODB_URI || "");
    uploadData.append("collection", process.env.MONGODB_COLLECTION || "");
    uploadData.append("compress", process.env.COMPRESS || "true");
    uploadData.append("image", image);

    const response = await fetch(
      String(process.env.UNLIMCLOUD_URL),
      {
        method: "POST",
        body: uploadData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === 'Missing required fields') {
        throw new Error("Ensure all environment variables (CHAT_ID, API_KEY, MONGODB_URI, COLLECTION_NAME) are set correctly");
      }
      throw new Error(errorData.message || "Upload failed");
    }

    const result = await response.json();
    const fileId = result.fileIds[0].fileId;

    return NextResponse.json(
      { message: "Image uploaded successfully", fileId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("Too many uploads") ? 429 : 500;
    return NextResponse.json(
      { error: status === 429 ? "Too many uploads, please try again later" : "Internal Server Error", details: message },
      { status }
    );
  }
}