import React, { useEffect, useState } from 'react';
import '../styles/styles.css';
import icon from '../assets/icon.png';
import { FiAlertTriangle } from 'react-icons/fi';

const MatchTracker = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://app.ftoyd.com/fronttemp-service/fronttemp'
      );
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data.data.matches);
      setMatches(data.data.matches);
    } catch (err) {
      setError('Ошибка: не удалось загрузить информацию');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'orange';
      case 'Finished':
        return 'red';
      case 'Ongoing':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'Planned';
      case 'Finished':
        return 'Finished';
      case 'Ongoing':
        return 'Live';
      default:
        return 'gray';
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Match Tracker</h1>
        <div className="controls">
          {error && (
            <div className="errors">
              <FiAlertTriangle className="alert-icon" />
              {error}
            </div>
          )}
          <button className="refresh-button" onClick={fetchMatches}>
            {loading ? 'Загрузка...' : 'Обновить'}
          </button>
        </div>
      </header>

      <div className="matches">
        {matches.map((match, index) => (
          <div className="match-row" key={index}>
            <div className="team left-team">
              <img
                src={match.homeTeam.logo ? match.homeTeam.logo : icon}
                alt={match.homeTeam.name}
                className="team-logo"
              />
              <span className="team-name">{match.homeTeam.name}</span>
            </div>

            <div className="app-score-status">
              <div className="score-status">
                <span className="score">
                  {match.homeScore} - {match.awayScore}
                </span>
                <div
                  className="status"
                  style={{ backgroundColor: getStatusColor(match.status) }}
                >
                  <span className="status-dot">{getStatus(match.status)}</span>
                </div>
              </div>
            </div>

            <div className="team right-team">
              <span className="team-name">{match.awayTeam.name}</span>
              <img
                src={match.homeTeam.logo ? match.homeTeam.logo : icon}
                alt={match.awayTeam.name}
                className="team-logo"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchTracker;
