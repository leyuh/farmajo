import { useEffect } from "react";
import "../styles/CropProgressBar.css";

const CropProgressBar = (props) => {
    let {
        selectedAcre,
        selectedPlot,
        crops,
        SEEDS,
        mouseTarget
    } = props;

    let crop = crops.find(val => (val.acre === selectedAcre && val.plot === selectedPlot));
    let pos = [mouseTarget.getClientRects()[0].left, mouseTarget.getClientRects()[0].top];
    let percentage = (SEEDS[crop.crop].growTime - crop.timeLeft) / SEEDS[crop.crop].growTime;

    return <div id="crop-progress-bar">
        <div id="crop-progress-bar-bg">
            <div id="crop-progress-bar-filler" style={{
                width: `${percentage*100}%`
            }}>
            </div>
        </div>
    </div>
}

export default CropProgressBar;