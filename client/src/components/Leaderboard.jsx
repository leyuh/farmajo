import { useEffect, useState } from "react";

import "../styles/Leaderboard.css";

const Leaderboard = ({ setShowLeaderboard }) => {

    const [topThreeFarms, setTopThreeFarms] = useState([]);
    const [farmsData, setFarmsData] = useState([]);
    const [matchingFarms, setMatchingFarms] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    const sortByLevel = (a, b) => {
        return b.level - a.level;
    }

    // GET FARMS DATA
    useEffect(() => {
        fetch("http://localhost:3001/farms/", {
            method: "GET",
            mode: "cors"
        })
            .then(res => res.json())
            .then(data => {
                let filteredData = [...data].filter(val => val.farmName !== "Joe's Farm" && val.farmName !== "Jenny's Farm");
                setFarmsData(filteredData);
                setMatchingFarms(filteredData);

                let topThree = filteredData.sort(sortByLevel).slice(0, Math.min(3, (filteredData.length + 1)));
                setTopThreeFarms(topThree);
            })

    }, [])

    // GET FARMS THAT MATCH SEARCH
    useEffect(() => {
        let newMatchingFarms = [];
        if (searchInput === "") {
            newMatchingFarms = [...farmsData];
        } else {
            for (let i = 0; i < farmsData.length; i++) {
                let name = farmsData[i].farmName.toLowerCase();
                if (name.indexOf(searchInput) !== -1) {
                    newMatchingFarms.push(farmsData[i]);
                }
            }
        }
        setMatchingFarms(newMatchingFarms);
    }, [searchInput])

    return <div id="leaderboard-div">
        <input type="text" id="leaderboard-search-bar" placeholder="search farms" onChange={(e) => {
            setSearchInput((e.target.value).toLowerCase());
        }}/>
        <button className="close-btn" onClick={() => setShowLeaderboard(false)}>X</button>
        <div id="users-list">
            {matchingFarms.sort(sortByLevel).map((val, i) => {
                return <div className={`user-div ${topThreeFarms.indexOf(val) === -1 ? '' : 'top-'+(topThreeFarms.indexOf(val)+1).toString()}`} key={i}>
                    <h1 className="user-farm-name">{val.farmName}</h1>
                    <h3 className="user-farm-id">{"#" + (val.farmId).toString().padStart(4, '0')}</h3>
                    
                    <h1 className="user-level">{val.level}</h1>
                    <h3 className="user-level-label">level</h3>
                </div>
            })}
        </div>
    </div>

}

export default Leaderboard;