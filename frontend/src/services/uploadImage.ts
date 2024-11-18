/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const uploadUrl = 'https://api.imgbb.com/1/upload';
const apiKey = 'f99f80c10706e67269cb555a1782ab64';
/**
 * Uploads an image file to the ImgBB API.
 * @param file - The image file to upload.
 * @param apiK - The API key for authentication.
 * @returns A Promise that resolves to the URL of the uploaded image.
 */
export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post<{ data: { url: string } }>(uploadUrl, formData, {
            params: { key: apiKey },
        });
        return response.data.data.url;
    } catch (error: any) {
        console.log('Error uploading image:', error.response?.data);
        throw new Error('Error uploading image');
    }
};