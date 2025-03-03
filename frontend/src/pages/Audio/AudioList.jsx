import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { formatDistanceToNow } from "date-fns";
import DeleteIcon from "@mui/icons-material/Delete";
import MicOffIcon from "@mui/icons-material/MicOff";

const AudioList = ({ userEmail }) => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAudios = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate email before request
        if (!userEmail || !userEmail.includes("@")) {
          throw new Error("Invalid email address");
        }

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/audio/user-audios?email=${encodeURIComponent(userEmail)}`
        );

        // Handle non-200 responses first
        if (!response.ok) {
          const errorBody = await response.text();
          console.error("API Error Response:", errorBody);
          throw new Error(`Request failed with status ${response.status}`);
        }

        // Verify content type
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const bodyPreview = await response.text();
          throw new Error(`
            Invalid content type: ${contentType}
            Response start: ${bodyPreview.slice(0, 100)}
          `);
        }

        const data = await response.json();

        // Validate response structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid API response format");
        }

        setAudios(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error details:", {
          error: err,
          userEmail,
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudios();
  }, [userEmail]);

  const handleDelete = async (audioId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/audio/delete-audio/${audioId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Delete Error:", errorData);
        return;
      }

      setAudios(audios.filter((audio) => audio._id !== audioId));
      alert("Audio deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <section className="audio-list__container">
      <header className="audio-list__header">
        <h2 className="audio-list__title">Your Recordings</h2>
        <div className="audio-list__count">{audios.length} items</div>
      </header>

      {audios.length === 0 ? (
        <div className="empty-state">
          <MicOffIcon className="empty-state__icon" />
          <p className="empty-state__text">No recordings found</p>
        </div>
      ) : (
        <div className="audio-list__grid">
          {audios.map((audio) => (
            <article key={audio._id} className="audio-card">
              <div className="audio-card__content">
                <AudioPlayer url={audio.audioUrl} />
                <div className="audio-card__meta">
                  <time className="audio-card__date">
                    {formatDistanceToNow(new Date(audio.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                  <button
                    className="audio-card__delete"
                    onClick={() => handleDelete(audio._id)}
                    aria-label="Delete recording"
                  >
                    <DeleteIcon className="delete-icon" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AudioList;
