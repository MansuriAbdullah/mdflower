/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * @param {File} file - The original image file.
 * @param {number} maxWidth - Maximum width of the compressed image.
 * @param {number} maxHeight - Maximum height of the compressed image.
 * @param {number} quality - Quality of compression (0.0 to 1.0).
 * @returns {Promise<File>} A promise that resolves to the compressed File object.
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    // Safety check: if file is not valid or has no name, return it immediately
    if (!file || !file.name) {
      console.warn('Invalid file object provided to compressor.');
      return resolve(file);
    }

    // If it's HEIC or HEIF, we let the backend handle it because canvas cannot render it natively
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'heic' || ext === 'heif') {
      console.log('Skipping client-side compression for HEIC file; letting backend handle it.');
      return resolve(file);
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
