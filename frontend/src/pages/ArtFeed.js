import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from '../components/ArtFeed/UploadForm';
import ArtCard from '../components/ArtFeed/ArtCard';
import { Button } from 'react-bootstrap';
import '../css/ArtFeed.css';

const ArtFeed = () => {
    const [artFeed, setArtFeed] = useState([]);
    const [newArtName, setNewArtName] = useState('');
    const [newArtFile, setNewArtFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visibleComments, setVisibleComments] = useState({});
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchArtFeed();
    }, [sortBy, sortOrder]);

    const fetchArtFeed = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/api/artFeed', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            let sortedArtFeed = response.data.slice();
            sortedArtFeed.sort((a, b) => {
                if (sortBy === 'likes') {
                    return sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes;
                } else if (sortBy === 'createdAt') {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                }
            });
            setArtFeed(sortedArtFeed);
            setVisibleComments(sortedArtFeed.reduce((acc, art) => ({
                ...acc,
                [art._id]: false
            }), {}));
        } catch (err) {
            setError('Failed to fetch ArtFeed. Please try again later.');
            console.error('Failed to fetch ArtFeed:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const toggleCommentsVisibility = id => {
        setVisibleComments(prevComments => ({
            ...prevComments,
            [id]: !prevComments[id]
        }));
    };

    const reverseArtFeed = () => {
        setArtFeed([...artFeed].reverse());
    };

    return (
        <div className="art-feed-container">
            <div className="art-feed-upload-section">
                <UploadForm
                    newArtName={newArtName}
                    setNewArtName={setNewArtName}
                    newArtFile={newArtFile}
                    setNewArtFile={setNewArtFile}
                    fetchArtFeed={fetchArtFeed}
                />
            </div>
            {error && <div className="art-feed-error-message">{error}</div>}
            {loading ? (
                <div className="art-feed-loading-message">Loading...</div>
            ) : (
                <div className="art-feed-art-cards-container">
                    <div className="sort-buttons">
                        <Button className="btn-orange" onClick={() => setSortBy('likes')}>Sort by Likes</Button>
                        <Button className="btn-orange" onClick={reverseArtFeed}>Sort by Newest</Button>
                    </div>
                    {artFeed.map(art => (
                        <ArtCard
                            key={art._id}
                            art={art}
                            visibleComments={visibleComments}
                            toggleCommentsVisibility={toggleCommentsVisibility}
                            fetchArtFeed={fetchArtFeed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtFeed;
