import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';

function PaintAlongPage() {
    const location = useLocation();
    const { pbnOutputUrl, colourKeyUrl } = location.state || {};
    const [paintColor, setPaintColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const pbnCanvasRef = useRef(null);
    const colourKeyCanvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [showColourKey, setShowColourKey] = useState(true);

    useEffect(() => {
        if (pbnOutputUrl && colourKeyUrl) {
            const loadImagesToCanvas = (url, canvasRef) => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = url;
            };

            loadImagesToCanvas(pbnOutputUrl, pbnCanvasRef);
            loadImagesToCanvas(colourKeyUrl, colourKeyCanvasRef);
        }
    }, [pbnOutputUrl, colourKeyUrl]);

    const toggleColourKey = () => {
        setShowColourKey(!showColourKey);
    };

    const pickColor = (event) => {
        const canvas = colourKeyCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        setPaintColor(color);
    };

    const startPainting = (e) => {
        const canvas = pbnCanvasRef.current;
        if (canvas) {
            setIsPainting(true);
            paint(e);
        }
    };

    const endPainting = () => {
        setIsPainting(false);
    };

    const paint = (event) => {
        if (!isPainting) return;
        const canvas = pbnCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        ctx.fillStyle = paintColor;
        ctx.fillRect(x, y, brushSize, brushSize);
    };

    return (
        <Container fluid>
            <Row className="justify-content-center mb-3">
                <Col lg={12} className="text-center">
                    <Form>
                        <Form.Group controlId="formBrushSize">
                            <Form.Label>Brush Size</Form.Label>
                            <Form.Range
                                min="1"
                                max="50"
                                value={brushSize}
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formColorPicker">
                            <Form.Label>Custom Color</Form.Label>
                            <Form.Control
                                type="color"
                                value={paintColor}
                                onChange={(e) => setPaintColor(e.target.value)}
                                title="Choose your color"
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col lg={6} className="text-center">
                    <h2>Paint By Numbers</h2>
                    <canvas ref={pbnCanvasRef} onMouseDown={startPainting} onMouseMove={paint} onMouseUp={endPainting} onMouseLeave={endPainting} />
                </Col>
                {showColourKey && (
                    <Col lg={6} className="text-center" style={{ marginTop: '20px' }}> 
                        <h2>
                            <span onClick={toggleColourKey} style={{ cursor: 'pointer' }}>
                                {showColourKey ? 'Hide' : 'Show'} Colour Key
                            </span>
                        </h2>
                        <canvas ref={colourKeyCanvasRef} onClick={pickColor} />
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default PaintAlongPage;
