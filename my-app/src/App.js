import React, { useState, useEffect } from 'react';
import './App.css'; // Your CSS file for styling
import BarChartRace from './BarChartRace';
import TextField from '@mui/material/TextField'; // Import the TextField component
import IconButton from '@mui/material/IconButton'; // Import IconButton for the submit button
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Import an arrow icon

const Dashboard = () => {
  // State for each card's count
  const [ideaCreators, setIdeaCreators] = useState(0);
  const [teamRegister, setTeamRegister] = useState(0);
  const [ideaNominated, setIdeaNominated] = useState(0);
  const [teamRequestedMentor, setTeamRequestedMentor] = useState(0);
  const [mentorsVolunteers, setMentorsVolunteers] = useState(0);

  // States for the additional three metrics in the second row
  const [additionalMetric1, setAdditionalMetric1] = useState(0);
  const [additionalMetric2, setAdditionalMetric2] = useState(0);
  const [additionalMetric3, setAdditionalMetric3] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Function to handle comment submission
  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim() !== '') {
      // Prepend new comment to the start of the array
      setComments([newComment, ...comments]); 
      setNewComment('');
    }
  };

  const [salesData, setSalesData] = useState([
    { month: 'January', sales: 120 },
    { month: 'February', sales: 150 },
    { month: 'March', sales: 80 },
    { month: 'April', sales: 200 },
    { month: 'May', sales: 180 },
    { month: 'June', sales: 220 },
    { month: 'July', sales: 140 },
    { month: 'August', sales: 210 },
    { month: 'September', sales: 240 },
    { month: 'October', sales: 180 },
    { month: 'November', sales: 160 },
    { month: 'Sept', sales: 140 },
    { month: 'Oct', sales: 150 },
    { month: 'Nov', sales: 190 },
    { month: 'December', sales: 190 }
  ]);

  // Function to generate random sales data
  const generateRandomSalesData = () => {
    return salesData.map(item => ({
      ...item,
      sales: Math.floor(Math.random() * 200) + 50 // Random sales value between 50 and 250
    }));
  };
  
  // UseEffect to increment data every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIdeaCreators(prevCount => prevCount + 1);
      setTeamRegister(prevCount => prevCount + 1);
      setIdeaNominated(prevCount => prevCount + 1);
      setTeamRequestedMentor(prevCount => prevCount + 1);
      setMentorsVolunteers(prevCount => prevCount + 1);
      setAdditionalMetric1(prevCount => prevCount + 1);
      setAdditionalMetric2(prevCount => prevCount + 1);
      setAdditionalMetric3(prevCount => prevCount + 1);
      setSalesData(generateRandomSalesData());
    }, 1000); // Update every 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [salesData]);

  return (
    <div className="dashboard">
      {/* First row with five cards */}
      <div className="row">
        <div className="card"><h4>Idea Creators</h4><p>{ideaCreators}</p></div>
        <div className="card"><h4>Team Registered</h4><p>{teamRegister}</p></div>
        <div className="card"><h4>Idea Nominated</h4><p>{ideaNominated}</p></div>
        <div className="card"><h4>Team needs Mentor</h4><p>{teamRequestedMentor}</p></div>
        <div className="card"><h4>Total Mentors</h4><p>{mentorsVolunteers}</p></div>
      </div>

      {/* Second row with three cards */}
      <div className="row">
        <div className="card"><h4>Unit Rank</h4><BarChartRace data={salesData} /></div>
        <div className="card"><h4>Employee Rank</h4><BarChartRace data={salesData} barColor="#9f8cc9" /></div>
        <div className="card comments-card">
          <h4>Live Comments</h4>
          <div className="comments-container">
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index}>{comment}</div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <button type="submit" className="submit-arrow">
                &#10148; {/* Unicode right arrow character */}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;