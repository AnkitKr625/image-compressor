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
      <div className="drag-drop-area flex-center ma-pa" onClick={uploadImageClicked} onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropHandler(e)}>

      <div className='flex-column-center'>
        <svg width="70" height="54">
          <path fill="#a2c6f0" d="M47.727 48v-6.4h7.955c4.393 0 7.954-3.582 7.954-8 0-4.006-2.947-7.382-6.851-7.924l-2.556-.355-.183-2.588C53.4 13.56 45.787 6.4 36.591 6.4c-9.201 0-16.815 7.168-17.456 16.345l-.241 3.447-3.399-.505a8 8 0 00-1.177-.087c-4.393 0-7.954 3.582-7.954 8s3.561 8 7.954 8h11.137V48H14.318C6.41 48 0 41.553 0 33.6c0-7.573 5.813-13.78 13.196-14.356C15.397 8.22 25.083 0 36.59 0c11.735 0 21.576 8.548 23.517 19.901C65.893 21.787 70 27.252 70 33.6 70 41.553 63.59 48 55.682 48h-7.955zm-6.394-13v19h-9.666V35H22l14.5-19L51 35h-9.667z"></path>
          </svg>
          <div style={{color: '#a2c6f0'}}>Drag & drop here to upload or <strong style={{color: '#4a90e2'}}>Browse</strong></div>
        </div>
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
          <img id='uploadedImgRef' src={uploadedImg} alt={'img'} width={300}/>
          <div className='ma-pa'> Size: {initialSize} Bytes</div>
        </span>
        <span style={ !compressedImg ? {visibility: 'hidden'} : {} } className='ma-pa flex-column-center'>
          <span>Compressed Image</span>
          <img src={compressedImg} alt={'img'} width={300}/>
          <div className='ma-pa'> Size: {finalSize} Bytes</div>
        </span>
      </div>
      {uploadedImg ? 
      <div className='ma-pa flex-column-center'>
        <span>
          <input type="range" name="quality" id="qualityRange" max={100} min={1} value={quality} onChange={(e) =>  setQuality(parseInt(e.target.value))}/>
        </span>
        <div>
          <button className='ma-pa btn' onClick={download}>Download</button>
        </div>
      </div> : ''}
    </>
  )
}

export default ImageUploader;