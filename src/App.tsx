import React, { useState, useRef, ChangeEvent, MouseEvent } from 'react';
import * as htmlToImage from 'html-to-image';
import './App.css';
import IconFile from './icons/icon-file.svg';

const App = (): JSX.Element =>{
  const [image, setImage] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);

  // Upload images logic
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload2 = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImage2(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  //Drag logic
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<HTMLImageElement>) => {
    setIsDragging(true);
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  //Screenshot logic
  const divRef = useRef<HTMLDivElement>(null);

  const captureDiv = () => {
    if (divRef.current) {
      htmlToImage.toPng(divRef.current)
      .then(function (dataUrl:any) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'captura.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(function (error:any) {
        console.error('Error al capturar el div:', error);
      });
    }
  };

  // Zoom logic
  const [Zoom, setZoom] = useState<string>()

  const handleChangeZoom = (e:ChangeEvent<HTMLInputElement>)=>{
    setZoom(e.target.value)
  }


  return (
    <div className="App">
      <header>
        <label className='FileButton'>
          <span>Cargar Imagen principal</span>
          <img src={IconFile} />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        <label className='FileButton'>
          <span>Cargar Imagen secundaria</span>
          <img src={IconFile} />
          <input type="file" accept="image/*" onChange={handleImageUpload2} />
        </label>
        <label className='ZoomControls'>
          <p>Zoom de la imagen 2</p>
          <input className='InputRange' type="range" min="0" max="5" step="0.1" value={Zoom} onChange={handleChangeZoom} disabled={image2 ? false:true}/>
        </label>
      </header>
      <footer>
        <button className="Button" onClick={captureDiv} disabled={image?false:true}>Descargar Meme</button>
      </footer>
      <main>
        <div className='ImagesCont' ref={divRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
          {image  && <img className="Image1" src={image}  alt="Imagen 1" style={{ maxWidth: '100%' }} /> }
          {image2 && <img className="Image2" src={image2} alt="Imagen 2" style={{ position: 'absolute', left: position.x, top: position.y, cursor: isDragging ? 'grabbing':'grab', scale: Zoom }} onMouseDown={handleMouseDown} onDragStart={(e) => e.preventDefault()} draggable="false" /> }
          {(!image && !image2) && <p>Cargá una imagen!</p> }
        </div>
      </main>
      
    </div>
  );
}

export default App;
