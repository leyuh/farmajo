import "../styles/LevelUpPanel.css";
import LEVEL_UNLOCKS from "../modules/unlocks.js";

const LevelUpPanel = (props) => {
    const {
        setShowLevelUpPanel,
        userLevel
    } = props;

    return <div id="level-up-panel">
        <div id="new-level-div">
            <h1>{userLevel}</h1>
        </div>
        <h1>Level Up!</h1>
        <div id="unlocks-div">
            {Object.keys(LEVEL_UNLOCKS[userLevel.toString()]).map((val, i) => {
                return <div className="unlock" key={i}>
                    <div className="circle">
                        <img src={LEVEL_UNLOCKS[userLevel.toString()][val]} />
                    </div>
                    <h3>{val}</h3>
                </div>
            })}
        </div>
        <button id="level-up-close-btn" onClick={() => setShowLevelUpPanel(false)}>Let's Go!</button>
    </div>
} 

export default LevelUpPanel;