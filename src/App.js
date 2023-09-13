import './App.css';
import { useState, useEffect } from 'react'; 
import { storage } from './firebase';
import { ref, uploadBytes, listAll, getDownloadURL}  from 'firebase/storage';
import { v4 } from 'uuid'; // For Generating Random Numbers in Image URL

function App() {
  const [imageUpload, setImageUpload] = useState(null); 

  // There has to be a better way to update each tier Individually //
  const [tierS, setTierS] = useState([]); 
  const [tierA, setTierA] = useState([]); 
  const [tierB, setTierB] = useState([]); 
  const [tierC, setTierC] = useState([]); 
  const [unratedImages, setUnratedImages] = useState([]); 


  // Gives Relationships Between tiers and their arrays
  const tiers = [
  {index: 0, name: 'S', color: '#f79f79', items:tierS, setItems: setTierS},
  {index: 1, name: 'A', color: '#f7d08a', items:tierA, setItems: setTierA}, 
  {index: 2, name: 'B', color: '#e3f09b', items:tierB, setItems: setTierB}, 
  {index: 3, name: 'C', color: '#87b6a7', items:tierC, setItems: setTierC}, 
  {index: 4, name: 'UNRATED', color: 'white', items:unratedImages, setItems: setUnratedImages}];

  const imageListRef = ref(storage, "images/"); // returns Storage Reference for given firebaseStorage+URL
  const sampleImageSets = ref(storage, "sample_images/"); // 


  const removeFromTier = (url, tierIndex) => { 
    const tier  = tiers[tierIndex]; 
    tier.setItems(tier.items.filter((u) => (u !== url))); 
    console.log("removed from tier "  + tierIndex + " length " + tiers[tierIndex].items.length); 
  } 

  const addToTier = (url, tierIndex) => { 
    const tier  = tiers[tierIndex]; 
    tier.setItems([...tier.items, url]); 
    console.log("added to tier "  + tierIndex + " length " + tiers[tierIndex].items.length); 
  }

  const allowDrop = (ev) => { // Allows Images to be Dropped
    ev.preventDefault();
  }

  const drag = (ev) => { // Moves Images
    ev.dataTransfer.setData("url", ev.target.id); // Dragged image's ID is its URL. 
    ev.dataTransfer.setData("source", (ev.target.parentNode).id);
    console.log("Source " + (ev.target.parentNode).id);
  }

  const drop = (ev) => { // When Images dropped, 
    ev.preventDefault();
    const url = ev.dataTransfer.getData("url"); // get image "url" from Data transfer
    const sourceID = parseInt(ev.dataTransfer.getData("source")); // get "source" id from data transfer
    const destID = parseInt((ev.target.id)); // ev.target is the dest dropped, id == tier.index or NOT
    if (ev.target.className === "itemContainer" || ev.target.className === "unratedContainer") { // Allow drop over containers only
      console.log("Dest " + ev.target.id)
      console.log("dest " + destID); 
      if (destID !== sourceID) {
        removeFromTier(url, sourceID); // removes from previous tier
        addToTier(url, destID); // adds to next tier
      }
    }
  }

  const uploadItem = () => { // Uploads Unrated Images
    if (imageUpload == null) return; 
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`); // makes reference to image folder

    uploadBytes(imageRef, imageUpload).then((snapshot) => { // uploadBytes returns a snapshot, Promise Containing ap Upload result
      alert("Image Uploaded");
      getDownloadURL(snapshot.ref).then((url) => {
        setUnratedImages((prev) => [...prev, url]);
      });
    })
  }
  
  const deleteUnratedItems = () => { // Deletes all Unrated Items

  }

  const saveCurrentItems = () => { // Saves current Uploaded Items into a Sample Items folder

  }

  useEffect(() => { // Runs Once Every Refresh

    listAll(imageListRef).then((response) => { // ListAll gets all files from imageListRef
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setUnratedImages((prev) => [...prev, url]);
        })
      })
    })

  }, []);

  return (
    <div className="App">

      <div className="infoSection">
        <h1>Tier-Lister</h1>
        <h6>Upload your own images to rank</h6>
        {/* <h6>...or use a previous template!</h6> */}
      </div>

      <div className="sideBySide">
        <div className="tierContainer">
          { tiers.map((tier) => { // Render Tier Rows
            return (
            <div className="tierRow">
              <div className="tierTitle" style={{backgroundColor:tier.color,}}>
                <p>{tier.name}</p>
              </div>
              <div
                className="itemContainer"
                id={tier.index}
                onDragOver={allowDrop}
                onDrop={drop}
              >
                { tier.items.map((url) => {
                  return <img 
                  className="item"
                  draggable="true"
                  onDragStart={drag}
                  src={url}
                  id={url}
                  alt=""
                  />
                  })
                }
              </div>
            </div>
          );})}
        </div>
        <div className="uploadSection">
          <div className="uploadButtons">
            <input 
              type="file" 
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            />
            <button onClick={uploadItem}>
              Upload Image 
            </button>
          </div>
          <div 
            className="unratedContainer"
            onDragOver={allowDrop}
            onDrop={drop}
          ></div>
        </div>
      </div>
      <div className="infoSection">
        <h1>Previously Made Templates</h1>
      </div>
    </div>
    
  );
}

export default App;
