import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; 
import {
    loadImagesToCanvas,
    startPainting as startPaintingFunc,
    endPainting as endPaintingFunc,
    paint as paintFunc,
    undo as undoFunc,
    redo as redoFunc,
    resetCanvas as resetCanvasFunc,
    handleZoomIn as handleZoomInFunc,
    handleZoomOut as handleZoomOutFunc,
    handleZoomReset as handleZoomResetFunc,
    downloadImage as downloadImageFunc,
    printImage as printImageFunc
} from '../components/PaintAlong/PaintAlongFunctions'; 

// PaintAlongPage component definition
function PaintAlongPage() {
    const location = useLocation(); // Getting location object
    const { pbnOutputUrl, colourKeyUrl } = location.state || {}; // Destructuring state from location object
    const [paintColor, setPaintColor] = useState('#000000'); // State for paint colour
    const [brushSize, setBrushSize] = useState(5); // State for brush size
    const [brushShape, setBrushShape] = useState('round'); // State for brush shape
    const pbnCanvasRef = useRef(null); // Ref for Paint By Numbers canvas
    const colourKeyCanvasRef = useRef(null); // Ref for colour key canvas
    const [isPainting, setIsPainting] = useState(false); // State for painting status
    const [showColourKey, setShowColourKey] = useState(true); // State for showing colour key
    const [history, setHistory] = useState([]); // State for painting history
    const [historyIndex, setHistoryIndex] = useState(-1); // State for history index
    const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level
    const [error, setError] = useState(null); // State for handling errors

    // Effect to load PBN image to canvas
    useEffect(() => {
        if (pbnOutputUrl) {
            loadImagesToCanvas(pbnOutputUrl, pbnCanvasRef)
                .catch(error => setError(`Failed to load PBN image: ${error.message}`)); // Handle image loading error
        }
    }, [pbnOutputUrl]);

    // Effect to load colour key image to canvas
    useEffect(() => {
        if (showColourKey && colourKeyUrl) {
            loadImagesToCanvas(colourKeyUrl, colourKeyCanvasRef)
                .catch(error => setError(`Failed to load colour key image: ${error.message}`)); // Handle image loading error
        }
    }, [showColourKey, colourKeyUrl]);

    // Function to toggle colour key visibility
    const toggleColourKey = () => {
        setShowColourKey(!showColourKey);
    };

    // Function to pick colour from colour key canvas
    const pickColour = (event) => {
        const canvas = colourKeyCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const colour = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        setPaintColor(colour);
    };

    // Function to handle brush size change
    const handleBrushSizeChange = (e) => {
        setBrushSize(Number(e.target.value));
    };

    // Function to handle colour change
    const handleColorChange = (e) => {
        setPaintColor(e.target.value);
    };

    // Function to handle brush shape change
    const handleBrushShapeChange = (e) => {
        setBrushShape(e.target.value);
    };

    // JSX return
    return (
        <Container fluid>
            <Row className="justify-content-center mb-3">
                <Col lg={2} className="text-center">
                    <Form>
                        <Form.Group controlId="formBrushSize">
                            <Form.Label>Brush Size</Form.Label>
                            <Form.Control
                                type="range"
                                min="1"
                                max="50"
                                value={brushSize}
                                onChange={handleBrushSizeChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBrushShape">
                            <Form.Label>Brush Shape</Form.Label>
                            <Form.Control
                                as="select"
                                value={brushShape}
                                onChange={handleBrushShapeChange}
                            >
                                <option value="round">Round</option>
                                <option value="square">Square</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formColorPicker">
                            <Form.Label>Custom Color</Form.Label>
                            <Form.Control
                                type="colour"
                                value={paintColor}
                                onChange={handleColorChange}
                                title="Choose your colour"
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-center mb-3">
                <Col lg={12} className="text-center">
                    <div className="button-container">
                        <div className="button-group">
                            <Button
                                onClick={toggleColourKey}
                                variant="orange"
                                className="paint-button"
                            >
                                {showColourKey ? 'Hide' : 'Show'} Colour Key
                            </Button>
                            <Button
                                onClick={() => resetCanvasFunc(pbnOutputUrl, setHistory, setHistoryIndex, loadImagesToCanvas, pbnCanvasRef)}
                                variant="orange"
                                className="paint-button"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={() => undoFunc(historyIndex, setHistoryIndex, history, pbnCanvasRef)}
                                variant="orange"
                                className="paint-button"
                            >
                                Undo
                            </Button>
                            <Button
                                onClick={() => redoFunc(historyIndex, setHistoryIndex, history, pbnCanvasRef)}
                                variant="orange"
                                className="paint-button"
                            >
                                Redo
                            </Button>
                            <Button
                                onClick={() => handleZoomInFunc(zoomLevel, setZoomLevel)}
                                variant="orange"
                                className="paint-button"
                            >
                                Zoom In
                            </Button>
                            <Button
                                onClick={() => handleZoomOutFunc(zoomLevel, setZoomLevel)}
                                variant="orange"
                                className="paint-button"
                            >
                                Zoom Out
                            </Button>
                            <Button
                                onClick={() => handleZoomResetFunc(setZoomLevel)}
                                variant="orange"
                                className="paint-button"
                            >
                                Reset Zoom
                            </Button>
                            <Button
                                onClick={() => downloadImageFunc(pbnCanvasRef)}
                                variant="orange"
                                className="paint-button"
                            >
                                Download Image
                            </Button>
                            <Button
                                onClick={() => printImageFunc(pbnCanvasRef)}
                                variant="orange"
                                className="paint-button"
                            >
                                Print Image
                            </Button>
                            <Button
                                as={Link}
                                to="/guide"
                                variant="orange"
                                className="paint-button"
                            >
                                Guide
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-center mb-3">
                <Col lg={6} className="text-center">
                    <h2>Paint By Numbers</h2>
                    <canvas
                        ref={pbnCanvasRef}
                        onMouseDown={(e) => startPaintingFunc(() => setIsPainting(true), () => paintFunc(isPainting, paintColor, brushSize, brushShape, zoomLevel, pbnCanvasRef, e), e)}
                        onMouseMove={(e) => paintFunc(isPainting, paintColor, brushSize, brushShape, zoomLevel, pbnCanvasRef, e)}
                        onMouseUp={() => endPaintingFunc(isPainting, setIsPainting, history, setHistory, historyIndex, setHistoryIndex, pbnCanvasRef)}
                        onMouseLeave={() => endPaintingFunc(isPainting, setIsPainting, history, setHistory, historyIndex, setHistoryIndex, pbnCanvasRef)}
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
                    />
                </Col>
                {showColourKey && (
                    <Col lg={6} className="text-center" style={{ marginTop: '5px' }}>
                        <h2>Colour Key</h2>
                        <canvas key={showColourKey} ref={colourKeyCanvasRef} onClick={pickColour} />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default PaintAlongPage;
