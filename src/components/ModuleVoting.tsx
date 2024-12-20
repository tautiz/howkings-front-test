import React, { useState, useEffect } from 'react';
import { addVote, VoteError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ModuleVotingProps {
    moduleId: number;
    initialVotes?: number;
}

export const ModuleVoting: React.FC<ModuleVotingProps> = ({ moduleId, initialVotes = 0 }) => {
    const [votes, setVotes] = useState(initialVotes);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Klausome balsavimo įvykių
        const handleVoteUpdate = (event: CustomEvent) => {
            if (event.detail.moduleId === moduleId) {
                setVotes(event.detail.votes);
            }
        };

        window.addEventListener('module:voted', handleVoteUpdate as EventListener);
        
        return () => {
            window.removeEventListener('module:voted', handleVoteUpdate as EventListener);
        };
    }, [moduleId]);

    const handleVote = async () => {
        if (!isAuthenticated) {
            // Rodyti pranešimą apie būtinybę prisijungti
            return;
        }

        setIsLoading(true);
        try {
            await addVote(moduleId);
            // UI bus atnaujintas per event listener
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === VoteError.ALREADY_VOTED) {
                    // Rodyti pranešimą, kad jau balsavo
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="module-voting">
            <button 
                onClick={handleVote}
                disabled={!isAuthenticated || isLoading}
                className={`vote-button ${isLoading ? 'loading' : ''}`}
            >
                {isLoading ? '...' : `👍 ${votes}`}
            </button>
            {!isAuthenticated && (
                <p className="vote-message">Prisijunkite, kad galėtumėte balsuoti</p>
            )}
        </div>
    );
};
