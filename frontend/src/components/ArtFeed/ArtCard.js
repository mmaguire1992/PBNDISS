import React, { useState } from 'react';
import axios from 'axios';
import { FaHeart, FaComment } from 'react-icons/fa';
import CommentForm from './CommentForm';

// Functional component for rendering an art card
const ArtCard = ({ art, visibleComments, toggleCommentsVisibility, fetchArtFeed }) => {
    // State for managing loading status and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to add a like to an art piece
    const addLike = async (imageId) => {
        try {
            setLoading(true); // Set loading status to true during async operation
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            await axios.patch(`http://localhost:4000/api/artFeed/like/${imageId}`, {}, {
                headers: { Authorization: `Bearer ${token}` } // Include token in request headers for authorisation
            });
            fetchArtFeed(); // Fetch updated art feed after liking
        } catch (err) {
            setError('Failed to like art. Please try again.'); // Set error message if fails
        } finally {
            setLoading(false); // Set loading status back to false regardless of success or failure
        }
    };

    // Render art card component
    return (
        <div className="art-feed-art-card" id={`art-card-${art._id}`}>
            <div className="art-title-container">
                <h5 className="art-title">{art.name}</h5> 
            </div>
            <img src={art.imageUrl} alt={art.title} className="art-image" id={`art-image-${art._id}`} /> 
            <div className="art-feed-art-card-info">
                <div className="art-feed-like-comment-icons">
                    
                    <button onClick={() => addLike(art._id)} disabled={loading} className="btn-icon" id={`like-button-${art._id}`}>
                        <FaHeart /> <span>{art.likes}</span> 
                    </button>
                    <button onClick={() => toggleCommentsVisibility(art._id)} className="btn-icon" id={`comment-button-${art._id}`}>
                        <FaComment />
                    </button>
                </div>
            </div>
            {visibleComments[art._id] && (
                <div className="comments-section" id={`comments-section-${art._id}`}>
                    {art.comments?.map((comment, index) => (
                        <p key={index}>{`${comment.commentText} - ${new Date(comment.commentedAt).toLocaleString()}`}</p>
                    ))}
                    <CommentForm artId={art._id} fetchArtFeed={fetchArtFeed} />
                </div>
            )}
            {error && <div className="art-feed-error-message" id={`error-message-${art._id}`}>{error}</div>}
        </div>
    );
};

export default ArtCard;
