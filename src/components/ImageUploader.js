import React, {useState, useRef, useEffect} from 'react';

function ImageUploader() {
  const [uploadedImg, setUploadedImg] = useState(null);
  const [compressedImg, setCompressededImg] = useState(null);
  const [imageDetail, setImageDetail] = useState(null);
  const [quality, setQuality] = useState(100);
  const [initialSize, setInitialSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const [finalSize, setFinalSize] = useState(0);
  const inputRef = useRef();

  const dragOverHandler = (event) => {
    event.preventDefault();
  }
  
  const dropHandler = (event) => {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    imageSelected(file);
  }

  const uploadImageClicked = () => {
    inputRef.current.click();
  }
  
  const imageSelected = async (file) => {
    const src = await fileToDataURL(file);
    setUploadedImg(src);
    setInitialSize(file.size);
    setFileName(file.name);
    setTimeout(() => {
      let imgToCom = document.getElementById('uploadedImgRef');
      const height = imgToCom.naturalHeight;
      const width = imgToCom.naturalWidth;
      setImageDetail(() => {
        return {
          type: file.type,
          width: width,
          height: height,
          imgTag: imgToCom,
        }
      })
    },50);
  }

  function fileToDataURL(file) {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.readAsDataURL(file);
    })
  }

  function compressImage(imageDetail, quality) {
    let { imgTag, type, height, width} = imageDetail;
    const convas = document.createElement('canvas');
    const context = convas.getContext('2d');
    convas.width = width;
    convas.height = height;
    context.drawImage(imgTag,0,0, width, height);
    convas.toBlob((blob) => {
      if(blob) {
        let compressedBlob = blob;
        let compressededImgSrc = URL.createObjectURL(compressedBlob);
        setCompressededImg(compressededImgSrc);
        setFinalSize(blob.size);
      }
    }, type, quality);
  }

  function download() {
    let a = document.createElement('a');
    a.href = compressedImg;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  useEffect(() => {
    if(imageDetail) {
      compressImage(imageDetail, quality/100);
    }
  }, [quality, imageDetail])

  return (
    <>
      <div className="drag-drop-area flex-center ma-pa" onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropHandler(e)}>
        <button onClick={uploadImageClicked} className='ma-pa'>Click Here to choose image</button>
        <input
          type="file"
          ref={inputRef}
          hidden={true}
          multiple={false}
          accept="image/*"
          onChange={(e) => imageSelected(e.target.files[0])}
        />
      </div>
      <div id="img-preview" className='flex-center'>
        <span style={ !uploadedImg ? {visibility: 'hidden'} : {} } className='ma-pa flex-column-center'>
          <span>Uploaded Image</span>
          <img id='uploadedImgRef' src={uploadedImg} alt={'img'}/>
          <div className='ma-pa'> Size: {initialSize} Bytes</div>
        </span>
        <span style={ !compressedImg ? {visibility: 'hidden'} : {} } className='ma-pa flex-column-center'>
          <span>Compressed Image</span>
          <img src={compressedImg} alt={'img'}/>
          <div className='ma-pa'> Size: {finalSize} Bytes</div>
        </span>
      </div>
      {uploadedImg ? 
      <div className='ma-pa flex-column-center'>
        <span>
          <input type="range" name="quality" id="qualityRange" max={100} min={1} value={quality} onChange={(e) =>  setQuality(parseInt(e.target.value))}/>
        </span>
        <div>
          <button className='ma-pa' onClick={download}>Download</button>
        </div>
      </div> : ''}
    </>
  )
}

export default ImageUploader;