import React from 'react';
import '../../styles/ScoreBoardListItem.css';

class ScoreBoardListItem extends React.Component {

  render() {
    return (
      <div className="ScoreBoardListItem-root">
        <span className="ScoreBoardListItem-root__ScoreKey">{this.props.score.scoreKey}</span>
        <span className="ScoreBoardListItem-root__ScoreValue" dangerouslySetInnerHTML={{ __html: this.props.score.scoreValue }} />
      </div>
    );
  }
}

export default ScoreBoardListItem;
