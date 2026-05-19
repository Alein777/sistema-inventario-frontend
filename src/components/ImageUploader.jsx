import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ imagenActualUrl, onImageChange, onImageRemove }) {
  const [preview, setPreview] = useState(imagenActualUrl || null);
  const [teniaGuardada, setTeniaGuardada] = useState(!!imagenActualUrl);
  const inputRef = useRef(null);

  useEffect(() => {
    setPreview(imagenActualUrl || null);
    setTeniaGuardada(!!imagenActualUrl);
  }, [imagenActualUrl]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('El archivo seleccionado no es una imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5 MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    onImageChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (teniaGuardada && onImageRemove) {
      onImageRemove();
      setTeniaGuardada(false);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const triggerFile = () => inputRef.current?.click();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Imagen del producto
      </label>

      {preview ? (
        <div style={{
          position: 'relative',
          width: '100%',
          height: 160,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: '#f8fafc',
        }}>
          <img
            src={preview}
            alt="Vista previa"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
          <button
            type="button"
            onClick={handleRemove}
            title="Quitar imagen"
            style={{
              position: 'absolute', top: 8, right: 8,
              width: 28, height: 28, borderRadius: '50%',
              border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={triggerFile}
            style={{
              position: 'absolute', bottom: 8, right: 8,
              padding: '5px 10px', borderRadius: 6,
              border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff',
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <Upload size={12} /> Cambiar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerFile}
          style={{
            width: '100%', height: 160,
            border: '2px dashed var(--border)',
            borderRadius: 8,
            background: '#f8fafc',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            color: 'var(--muted)',
            fontFamily: 'inherit',
          }}
        >
          <ImageIcon size={28} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Subir imagen</span>
          <span style={{ fontSize: 11 }}>JPG, PNG o WEBP · máx 2 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}