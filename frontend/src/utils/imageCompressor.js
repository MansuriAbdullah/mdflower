// Helper function to dynamically load heic2any library from CDN only when needed
const loadHeic2Any = () => {
  return new Promise((resolve, reject) => {
    if (window.heic2any) {
      return resolve(window.heic2any);
    }
    // Check if script is already added
    let script = document.querySelector('script[src*="heic2any"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    // Wait for the script to load
    script.addEventListener('load', () => {
      if (window.heic2any) {
        resolve(window.heic2any);
      } else {
        reject(new Error('heic2any script loaded but global object not found.'));
      }
    });
    script.addEventListener('error', (err) => reject(err));
  });
};

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Supports HEIC/HEIF (iPhone) conversion using dynamic heic2any loading.
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width of the compressed image.
 * @param {number} maxHeight - Maximum height of the compressed image.
 * @param {number} quality - Quality of compression (0.0 to 1.0).
 * @returns {Promise<File|Blob>} A promise that resolves to the compressed File or Blob object.
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise(async (resolve) => {
    // Safety check: if file is not valid or has no name, return it immediately
    if (!file || !file.name) {
      console.warn('Invalid file object provided to compressor.');
      return resolve(file);
    }

    let ext = file.name.split('.').pop().toLowerCase();
    
    // If it's HEIC or HEIF, convert it to JPEG on the client side
    if (ext === 'heic' || ext === 'heif') {
      try {
        console.log('HEIC/HEIF file detected. Loading heic2any converter from CDN...');
        const heic2any = await loadHeic2Any();
        
        console.log('Converting HEIC to JPEG on client side...');
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.7
        });
        
        const jpegBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        
        // Re-create file as a JPEG file/blob
        const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
        try {
          file = new File([jpegBlob], newName, { type: 'image/jpeg' });
        } catch (e) {
          jpegBlob.name = newName;
          file = jpegBlob;
        }
        
        // Set extension to JPEG to proceed with canvas compression/resizing
        ext = 'jpg';
        console.log('HEIC successfully converted to JPEG!');
      } catch (err) {
        console.error('Failed to convert HEIC on client side, uploading raw HEIC:', err);
        // Fallback: let the canvas/reader try to process it, or let the backend handle it
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Safety check for browser support of Canvas and toBlob
        if (!canvas || !canvas.getContext || !canvas.toBlob) {
          console.warn('Canvas or toBlob is not supported in this browser; falling back to original file.');
          return resolve(file);
        }

        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Failed to get 2D context; falling back to original file.');
          return resolve(file);
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas drawing back to a Blob, then to a File
        canvas.toBlob(
          (blob) => {
            if (blob) {
              try {
                // Attempt to create a File object (preferred)
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                console.log(
                  `Compressed: ${file.name} | Original: ${(file.size / 1024).toFixed(1)} KB -> Compressed: ${(compressedFile.size / 1024).toFixed(1)} KB`
                );
                resolve(compressedFile);
              } catch (e) {
                // Fallback for older iOS Safari/in-app webviews that don't support "new File()" constructor
                console.log('File constructor failed, falling back to Blob object.');
                blob.name = file.name;
                resolve(blob);
              }
            } else {
              console.warn('Canvas blob generation failed; falling back to original file.');
              resolve(file); // fallback
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => {
        console.error('Failed to load image in Canvas; falling back to original file.', err);
        resolve(file); // fallback
      };
    };
    reader.onerror = (err) => {
      console.error('FileReader failed; falling back to original file.', err);
      resolve(file); // fallback
    };
  });
};
