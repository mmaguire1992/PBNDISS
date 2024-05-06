import React, { useState } from 'react';
import axios from 'axios';

// CommentForm component for adding comments
const CommentForm = ({ artId, fetchArtFeed }) => {
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false); 
    
    // Function to handle submission of a comment
    const submitComment = async (e) => {
        e.preventDefault();
        if (!comment) {
            setError('Please enter a comment.');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            // Sending a POST request to add a comment
            await axios.post(
                `http://localhost:4000/api/artFeed/${artId}/comment`,
                { comment },
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            // Fetch updated art feed after adding the comment
            fetchArtFeed();
            // Clearing the comment input after submission
            setComment('');
            // Set submitted flag to true
            setSubmitted(true);
            // Clear any previous error messages
            setError(null);
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Failed to post comment:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle closing the success message
    const handleCloseSuccess = () => {
        setSubmitted(false);
    };

    return (
        <form onSubmit={submitComment} className="mb-3" id="comment-form">
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    disabled={loading}
                    id="comment-input"
                />
            </div>
            {/* Displaying error message*/}
            {error && <div className="text-danger mb-2" id="comment-error">{error}</div>}
            {/* Displaying success message */}
            {submitted && (
                <div className="alert alert-success mb-2" onClick={handleCloseSuccess} id="comment-success">
                    Comment posted successfully! Click here to close.
                </div>
            )}
            {/* Button for submitting the comment */}
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-comment-button">
                {/* Displaying appropriate text based on loading state */}
                {loading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};

export default CommentForm;
