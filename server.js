const express = require('express');
const cors = require('cors');
// Nota: En un entorno real, usarías una librería como 'twitter-url-direct' o ejecutarías 'yt-dlp'
const { getDirectLinks } = require('twitter-url-direct'); 

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
    const { url, format } = req.body;
    
    if (!url || !url.includes('twitter.com') && !url.includes('x.com')) {
        return res.status(400).json({ error: 'Enlace de Twitter/X no válido.' });
    }

    try {
        // Obtenemos los enlaces directos del video de Twitter
        const videoData = await getDirectLinks(url);
        
        if (!videoData || videoData.length === 0) {
            return res.status(404).json({ error: 'No se encontraron videos en este enlace.' });
        }

        // videoData suele devolver un array con distintas calidades
        const videoUrl = videoData[0].url; 

        if (format === 'mp3') {
            // Para MP3 real en producción, se suele redirigir a un conversor 
            // o procesar el buffer con fluent-ffmpeg.
            return res.json({ downloadUrl: videoUrl, note: "Descargando como video (puedes renombrarlo a .mp3 o usar ffmpeg en tu servidor)" });
        }

        return res.json({ downloadUrl: videoUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar el video. Intenta de nuevo.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));