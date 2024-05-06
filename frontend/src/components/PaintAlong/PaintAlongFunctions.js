// Function to load images to the canvas
export const loadImagesToCanvas = (url, canvasRef) => {
    return new Promise((resolve, reject) => {
        // Get canvas element from the canvas reference
        const canvas = canvasRef.current;
        // Reject if the canvas reference is not available
        if (!canvas) reject(new Error('Canvas reference is not available.'));
        // Get the 2D rendering context of the canvas
        const ctx = canvas.getContext('2d');
        // Create a new image element
        const img = new Image();
        // Allow access to image data from other domains
        img.crossOrigin = 'anonymous';
        // Load image when it's ready
        img.onload = () => {
            // Adjust canvas dimensions based on image dimensions
            canvas.width = img.width / 3;
            canvas.height = img.height / 3;
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Resolve the promise
            resolve();
        };
        // Handle error if image loading fails
        img.onerror = (error) => reject(error);
        // Set the image source
        img.src = url;
    });
};

// Function to start painting
export const startPainting = (setIsPainting, paint, e) => {
    // Set the painting state to true
    setIsPainting(true);
    // Call the paint function
    paint(e);
};

// Function to end painting
export const endPainting = (isPainting, setIsPainting, history, setHistory, historyIndex, setHistoryIndex, canvasRef) => {
    // If not painting, return
    if (!isPainting) return;
    // Set the painting state to false
    setIsPainting(false);
    // If history index is not at the latest, update history
    if (historyIndex !== history.length - 1) {
        setHistory(history.slice(0, historyIndex + 1));
    }
    // Get the canvas and its image data
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    // Update history and history index
    setHistory([...history, imageData]);
    setHistoryIndex(history.length);
};

// Function to perform painting
export const paint = (isPainting, paintColour, brushSize, brushShape, zoomLevel, canvasRef, event) => {
    // If not painting, return
    if (!isPainting) return;
    // Get canvas and its 2D rendering context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Get the canvas rectangle
    const rect = canvas.getBoundingClientRect();
    // Calculate painting position based on zoom level
    const x = (event.clientX - rect.left) / zoomLevel;
    const y = (event.clientY - rect.top) / zoomLevel;
    // Set painting colour
    ctx.fillStyle = paintColour;
    // Perform painting based on brush shape
    if (brushShape === 'round') {
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
        ctx.fill();
    } else if (brushShape === 'square') {
        ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }
};

// Function to undo last action
export const undo = (historyIndex, setHistoryIndex, history, canvasRef) => {
    // If there's no action to undo, return
    if (historyIndex > 0) {
        // Update history index
        setHistoryIndex(historyIndex - 1);
        // Get canvas and its 2D rendering context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Create a new image element to load the previous state
        const img = new Image();
        img.onload = () => {
            // Clear canvas and draw the previous state
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        // Set the source of the image
        img.src = history[historyIndex - 1];
    }
};

// Function to redo undone action
export const redo = (historyIndex, setHistoryIndex, history, canvasRef) => {
    // If there's no action to redo, return
    if (historyIndex < history.length - 1) {
        // Update history index
        setHistoryIndex(historyIndex + 1);
        // Get canvas and its 2D rendering context
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Create a new image element to load the next state
        const img = new Image();
        img.onload = () => {
            // Clear canvas and draw the next state
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        // Set the source of the image
        img.src = history[historyIndex + 1];
    }
};

// Function to reset canvas
export const resetCanvas = (pbnOutputUrl, setHistory, setHistoryIndex, loadImagesToCanvas, canvasRef) => {
    // Get canvas and its 2D rendering context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Clear canvas and reset history
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryIndex(-1);
    // If there's a PBN output URL, load it onto the canvas
    if (pbnOutputUrl) {
        loadImagesToCanvas(pbnOutputUrl, canvasRef);
    }
};

// Function to handle zoom in
export const handleZoomIn = (zoomLevel, setZoomLevel) => {
    // Increase the zoom level by 0.1
    setZoomLevel(zoomLevel + 0.1);
};

// Function to handle zoom out
export const handleZoomOut = (zoomLevel, setZoomLevel) => {
    // Decrease the zoom level by 0.1
    setZoomLevel(zoomLevel - 0.1);
};

// Function to reset zoom level
export const handleZoomReset = (setZoomLevel) => {
    // Set the zoom level back to 1
    setZoomLevel(1);
};

// Function to download image
export const downloadImage = (canvasRef) => {
    // Get canvas and its data URL
    const canvas = canvasRef.current;
    const url = canvas.toDataURL();
    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = url;
    link.download = 'painted_image.png';
    // Append link to the document body, trigger click event, and remove link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Function to print image
export const printImage = (canvasRef) => {
    // Get canvas and its data URL
    const canvas = canvasRef.current;
    const url = canvas.toDataURL();
    // Create window content with image
    const windowContent = `<img src="${url}" style="width:100%;" />`;
    // Open a new window and print the image
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.open();
    printWindow.document.write(windowContent);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
};
