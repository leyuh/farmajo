import "../styles/LevelDisplay.css";
import RenameImg from "../images/pencil.png";

const LevelDisplay = (props) => {
    const {
        farmId,
        farmName,
        setFarmName,
        userLevel,
        userLevelProgress,
        renamingFarm,
        setRenamingFarm
    } = props;

    const searchKey = (e) => {
        if (e.key === "Enter") {
            setFarmName(e.target.value);
            setRenamingFarm(false);
        }
    }

    return <div id="level-display">
        <div id="level-name-div">
            {renamingFarm && <input
                type="text"
                id="new-farm-name-input"
                autoFocus={true}
                onKeyDown={searchKey}/>
            }
            <button id="rename-btn" onClick={() => setRenamingFarm(prev => !prev)}>
                <img src={RenameImg}/>
            </button>
            <h1>{farmName}</h1>
            <h3 id="farm-id">{`${farmId ? ("#" + farmId.toString().padStart(4, "0")) : ""}`}</h3>
        </div>

        <div id="level-bar-background">
            <div id="level-bar" style={{
                "width": `${Math.min(userLevelProgress, 1)*100}%`
            }}/>
        </div>

        <div id="level-div">
            <h3>{userLevel}</h3>
        </div>
    </div>
}

export default LevelDisplay;