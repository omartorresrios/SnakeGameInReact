import React from 'react';
import ScoreBoardListItem from './ScoreBoardListItem';
import '../../styles/ScoreBoardList.css';

class ScoreBoardList extends React.Component {

  render() {
    return (
      <div className="ScoreBoardList__root">
        {this.renderScoreBoardHeading()}
        {this.renderScores()}
      </div>
    );
  }

  renderScores() {
    return this.props.scores.map((score) => {
      return <ScoreBoardListItem key={score.id} score={score}/>
    });
  }

  renderScoreBoardHeading() {
    if (this.props.scores.length === 0) { return; }

    return <h4>ScoreBoard</h4>
  }
}

export default ScoreBoardList;
