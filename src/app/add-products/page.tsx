"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import axios from "axios";
import { 
  ImagePlus, 
  X, 
  Upload, 
  Check, 
  Star, 
  StarOff,
  Loader2,
  Save
} from "lucide-react";

interface ImageFile extends File {
  preview?: string;
  id?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: boolean;
  fileId?: string;
}

interface AttributeItem {
  value: string;
  price?: number | '';
  photos: ImageFile[];
}

interface AttributeArrays {
  size: AttributeItem[];
  color: AttributeItem[];
}

export default function AddProductsPage() {
  // Product details
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [price, setPrice] = useState<string>(""); // New state for global price
  
  // Attribute arrays with prices and photos
  const [attributes, setAttributes] = useState<AttributeArrays>({
    size: [],
    color: [],
  });
  const [attributeInput, setAttributeInput] = useState<{ key: keyof AttributeArrays; value: string; price: string }>({
    key: "size",
    value: "",
    price: "",
  });
  const [selectedAttribute, setSelectedAttribute] = useState<{ key: keyof AttributeArrays; value: string } | null>(null);
  
  // Images
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  
  // Submission
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle dropped files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2),
        uploading: false,
        uploaded: false,
        error: false
      })
    );
    
    if (selectedAttribute) {
      setAttributes(prev => ({
        ...prev,
        [selectedAttribute.key]: prev[selectedAttribute.key].map(item =>
          item.value === selectedAttribute.value ? { ...item, photos: [...item.photos, ...newFiles] } : item
        )
      }));
    } else {
      setFiles(prev => [...prev, ...newFiles]);
      if (mainImageIndex === null && files.length === 0) {
        setMainImageIndex(0);
      }
    }
  }, [files, mainImageIndex, selectedAttribute]);

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true
  });

  // Handle file selection via browse button
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    onDrop(selectedFiles);
    
    e.target.value = '';
  };
  
  // Handle manually selecting a file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Remove a file from the list
  const removeFile = (id: string, isAttributePhoto: boolean = false) => {
    if (isAttributePhoto && selectedAttribute) {
      setAttributes(prev => ({
        ...prev,
        [selectedAttribute.key]: prev[selectedAttribute.key].map(item =>
          item.value === selectedAttribute.value
            ? { ...item, photos: item.photos.filter(photo => photo.id !== id) }
            : item
        )
      }));
    } else {
      const fileIndex = files.findIndex(file => file.id === id);
      if (mainImageIndex === fileIndex) {
        if (files.length > 1) {
          setMainImageIndex(fileIndex === 0 ? 1 : 0);
        } else {
          setMainImageIndex(null);
        }
      } else if (mainImageIndex !== null && fileIndex < mainImageIndex) {
        setMainImageIndex(mainImageIndex - 1);
      }
      const newFiles = [...files];
      URL.revokeObjectURL(newFiles[fileIndex].preview || "");
      newFiles.splice(fileIndex, 1);
      setFiles(newFiles);
    }
  };
  
  // Set a file as the main image
  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
  };
  
  // Add a tag
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Add an attribute value with price
  const addAttributeValue = () => {
    if (attributeInput.value && !attributes[attributeInput.key].some(item => item.value === attributeInput.value)) {
      setAttributes(prev => ({
        ...prev,
        [attributeInput.key]: [
          ...prev[attributeInput.key],
          {
            value: attributeInput.value,
            price: attributeInput.price ? parseFloat(attributeInput.price) : undefined,
            photos: []
          }
        ]
      }));
      setAttributeInput(prev => ({ ...prev, value: "", price: "" }));
    }
  };
  
  // Remove an attribute value
  const removeAttributeValue = (key: keyof AttributeArrays, value: string) => {
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key].filter(item => item.value !== value)
    }));
    if (selectedAttribute?.value === value) {
      setSelectedAttribute(null);
    }
  };
  
  // Select an attribute for photo upload
  const selectAttributeForPhotos = (key: keyof AttributeArrays, value: string) => {
    setSelectedAttribute({ key, value });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Check if there are any images
      if (files.length === 0 && attributes.size.every(item => item.photos.length === 0) && attributes.color.every(item => item.photos.length === 0)) {
        throw new Error("Please upload at least one image for the main product or attributes");
      }
      
      // Check if a main image is selected
      if (mainImageIndex === null && files.length > 0) {
        throw new Error("Please select a main image");
      }
      
      // Upload main images
      const uploadedMainFiles = files.length > 0 ? await Promise.all(
        files.map(async (file, index) => {
          setFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], uploading: true };
            return newFiles;
          });

          try {
            const formData = new FormData();
            formData.append("productId", "temp");
            formData.append("image", file);

            const response = await axios.post("/api/v1/products/images", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            setFiles(prev => {
              const newFiles = [...prev];
              newFiles[index] = {
                ...newFiles[index],
                uploading: false,
                uploaded: true,
                error: false,
                fileId: response.data.fileId,
              };
              return newFiles;
            });

            return {
              fileId: response.data.fileId,
              isMain: index === mainImageIndex,
            };
          } catch (error) {
            setFiles(prev => {
              const newFiles = [...prev];
              newFiles[index] = {
                ...newFiles[index],
                uploading: false,
                uploaded: false,
                error: true,
              };
              return newFiles;
            });
            throw error;
          }
        })
      ) : [];

      // Upload attribute photos
      const uploadAttributePhotos = async (items: AttributeItem[]): Promise<{ value: string; fileId: string; price?: number }[]> => {
        const results = [];
        for (const item of items) {
          const photoUploads = await Promise.all(
            item.photos.map(async (photo) => {
              const formData = new FormData();
              formData.append("productId", "temp");
              formData.append("image", photo);

              const response = await axios.post("/api/v1/products/images", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              return response.data.fileId;
            })
          );
          // Convert price to number or undefined to match the expected type
          const priceValue = typeof item.price === 'number' ? item.price : undefined;
          results.push({ value: item.value, fileId: photoUploads[0] || "", price: priceValue });
        }
        return results;
      };

      const sizeAttributes = await uploadAttributePhotos(attributes.size);
      const colorAttributes = await uploadAttributePhotos(attributes.color);

      // Collect fileIds
      const mainImageFileId = uploadedMainFiles.find(img => img.isMain)?.fileId;
      const galleryFileIds = uploadedMainFiles.filter(img => !img.isMain).map(img => img.fileId);

      // Create product data with main image, galleries, attribute details, and global price
      const productData = {
        title: productName,
        description,
        category,
        tags,
        fileId: mainImageFileId || "",
        gallery: galleryFileIds,
        attributes: {
          size: sizeAttributes,
          color: colorAttributes,
        },
        price: price ? parseFloat(price) : undefined, // Include global price
        password: adminPassword,
      };

      // Submit the product
      const response = await axios.post("/api/v1/products/add", productData);
      const newProductId = response.data.productId;
      setProductId(newProductId);

      setSubmitSuccess(true);

      setTimeout(() => {
        setProductName("");
        setDescription("");
        setCategory("");
        setTags([]);
        setTagInput("");
        setAttributes({ size: [], color: [] });
        setAttributeInput({ key: "size", value: "", price: "" });
        setFiles([]);
        setMainImageIndex(null);
        setAdminPassword("");
        setPrice(""); // Reset price
        setProductId(null);
        setSubmitSuccess(false);
        setSelectedAttribute(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting product:", error);
      setSubmitError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview || ""));
      Object.values(attributes).forEach(items => 
        items.forEach((item: { photos: ImageFile[]; }) => item.photos.forEach((photo: ImageFile) => URL.revokeObjectURL(photo.preview || "")))
      );
    };
  }, [files, attributes]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Add New Product
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Product Images</h2>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <input {...getInputProps()} />
                <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports: JPEG, PNG, WebP, GIF
                </p>
              </div>
              
              <button 
                type="button"
                onClick={triggerFileInput}
                className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="mr-2 h-4 w-4" />
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* Preview of uploaded images */}
              {files.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {files.length} image{files.length !== 1 ? 's' : ''} selected 
                    {mainImageIndex !== null && (
                      <span className="ml-1">
                        (Click <StarOff className="inline h-4 w-4 text-gray-400" /> to set as main image)
                      </span>
                    )}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map((file, index) => (
                      <div 
                        key={file.id} 
                        className={`relative group rounded-lg overflow-hidden border ${
                          mainImageIndex === index 
                            ? 'border-amber-500 ring-2 ring-amber-500' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={file.preview || ""}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                          {file.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 text-white animate-spin" />
                            </div>
                          )}
                          {file.uploaded && (
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {file.error && (
                            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                              <X className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {mainImageIndex === index ? (
                            <div className="p-1 bg-amber-500 rounded-full">
                              <Star className="h-5 w-5 text-white" />
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => setAsMainImage(index)}
                              className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                            >
                              <StarOff className="h-5 w-5 text-gray-600" />
                            </button>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeFile(file.id || "")}
                            className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <X className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                        {mainImageIndex === index && (
                          <div className="absolute bottom-0 left-0 right-0 bg-amber-500 text-white text-xs text-center py-1">
                            Main Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Attribute Arrays Section with Prices and Photos */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Attributes</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <select
                    value={attributeInput.key}
                    onChange={(e) => setAttributeInput(prev => ({ ...prev, key: e.target.value as keyof AttributeArrays }))}
                    className="mt-1 block w-1/3 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="size">Size</option>
                    <option value="color">Color</option>
                  </select>
                  <input
                    type="text"
                    value={attributeInput.value}
                    onChange={(e) => setAttributeInput(prev => ({ ...prev, value: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttributeValue())}
                    className="flex-1 min-w-0 block w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={`Add a ${attributeInput.key}`}
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={attributeInput.price}
                    onChange={(e) => setAttributeInput(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Price"
                    className="w-1/4 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={addAttributeValue}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    Add
                  </button>
                </div>
                
                {Object.entries(attributes).map(([key, items]) => (
                  items.length > 0 && (
                    <div key={key} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 capitalize">{key}</h3>
                      <div className="space-y-4">
                        {items.map((item: AttributeItem, index: number) => (
                          <div key={index} className="flex items-center gap-4 p-2 border border-gray-200 rounded-md">
                            <span className="text-sm font-medium">{item.value}</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price === undefined ? "" : item.price}
                              onChange={(e) => {
                                const newPrice = e.target.value ? parseFloat(e.target.value) : undefined;
                                setAttributes(prev => ({
                                  ...prev,
                                  [key as keyof AttributeArrays]: prev[key as keyof AttributeArrays].map((i, iIndex) =>
                                    iIndex === index ? { ...i, price: newPrice } : i
                                  )
                                }));
                              }}
                              placeholder="Price"
                              className="w-1/4 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => selectAttributeForPhotos(key as keyof AttributeArrays, item.value)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-xs"
                            >
                              <ImagePlus className="h-4 w-4 mr-1" /> Add Photos
                            </button>
                            <button
                              type="button"
                              onClick={() => removeAttributeValue(key as keyof AttributeArrays, item.value)}
                              className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {item.photos.length > 0 && (
                              <div className="grid grid-cols-2 gap-2">
                                {item.photos.map((photo: ImageFile) => (
                                  <div key={photo.id} className="relative h-16 w-16">
                                    <Image
                                      src={photo.preview || ""}
                                      alt={`${item.value} photo`}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeFile(String(photo.id || ""), true)}
                                      className="absolute top-0 right-0 bg-white rounded-full p-0.5 hover:bg-gray-200"
                                    >
                                      <X className="h-4 w-4 text-red-500" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Product Details</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 min-w-0 block w-full py-2 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    Add
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Admin Password */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
                  Admin Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Submit Button and Messages */}
            <div className="pt-5 border-t border-gray-200">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {submitError}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Success
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        Product added successfully! Product ID: {productId}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !productName || (files.length === 0 && attributes.size.every(item => item.photos.length === 0) && attributes.color.every(item => item.photos.length === 0)) || mainImageIndex === null || !adminPassword}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting || !productName || (files.length === 0 && attributes.size.every(item => item.photos.length === 0) && attributes.color.every(item => item.photos.length === 0)) || mainImageIndex === null || !adminPassword
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}