import React from 'react';
import './VotesLeft.css';

export function VotesLeft({count}) {
    return (
        <div className="votes-left">
          {count} votes left!
        </div>
    );
}
