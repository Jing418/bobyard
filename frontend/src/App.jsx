import { useEffect, useState } from "react";

const formatDate = (isoString) => {
  const d = new Date(isoString);

  const pad = (n) => String(n).padStart(2, "0");

  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const year = d.getFullYear();

  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Theme (dark / light)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch comments
  useEffect(() => {
    fetch("http://localhost:8000/api/comments/")
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Add
  const handleAdd = async () => {
    if (!newText.trim()) return;

    const res = await fetch("http://localhost:8000/api/comments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newText,
        image: newImage || null,
      }),
    });

    const created = await res.json();
    setComments((prev) => [created, ...prev]);
    setNewText("");
    setNewImage("");
  };

  // Edit
  const handleUpdate = async (id) => {
    const res = await fetch(
      `http://localhost:8000/api/comments/${id}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      }
    );

    const updated = await res.json();
    setComments((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    );
    setEditingId(null);
    setEditingText("");
  };

  // Optimistic Like
  const handleLike = async (id) => {
    // 1. Check local storage to toggle state
    const likedComments = JSON.parse(localStorage.getItem('liked_comments') || '[]');
    const isAlreadyLiked = likedComments.includes(id);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    let updatedLikesValue;

    // 2. Optimistic UI update (Toggle +1 or -1)
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updatedLikesValue = isAlreadyLiked ? Math.max(0, (c.likes || 0) - 1) : (c.likes || 0) + 1;
          return { ...c, likes: updatedLikesValue };
        }
        return c;
      })
    );

    try {
      // 3. Sending request
      const res = await fetch(`http://localhost:8000/api/comments/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: updatedLikesValue }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Server responded with an error");

      // 4. Update local storage on success
      const nextLikedState = isAlreadyLiked 
        ? likedComments.filter(favId => favId !== id) 
        : [...likedComments, id];
      localStorage.setItem('liked_comments', JSON.stringify(nextLikedState));

    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Like failed, rolling back. Reason:", err.name === 'AbortError' ? 'Timeout' : err.message);

      // 5. Rollback UI to previous state
      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, likes: isAlreadyLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 1) - 1) } : c
        )
      );

      alert("Failed to update likes. Please check your connection.");
    }
  };

  
  // Delete with confirmation
  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this comment?\nThis action cannot be undone."
    );

    if (!ok) return;

    await fetch(`http://localhost:8000/api/comments/${id}/`, {
      method: "DELETE",
    });

    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="loading">Loading discussions…</div>;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="hero">
        <h1>Discussion Board</h1>
        <p>Internal technical feedback and admin comments</p>

        <button
          className="btn ghost theme-toggle"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Composer */}
      <section className="composer">
        <div className="composer-header">
          <span className="badge">ADMIN</span>
        </div>

        <textarea
          placeholder="Write a comment…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />

        <input
          className="image-input"
          type="text"
          placeholder="Optional image URL (https://...)"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />

        <div className="composer-actions">
          <button className="btn primary" onClick={handleAdd}>
            Post
          </button>
        </div>
      </section>

      {/* Comment List */}
      <section className="list">
        {comments.map((c) => (
          <article className="comment" key={c.id}>
            <div className="meta">
              <div className="user">
                <div className="avatar">{c.author[0]}</div>
                <strong>{c.author}</strong>
              </div>
              <time>{formatDate(c.date)}</time>
            </div>

            {editingId === c.id ? (
              <textarea
                className="edit-box"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <p className="content">{c.text}</p>
            )}

            {c.image && (
              <a
                href={c.image}
                target="_blank"
                rel="noopener noreferrer"
                className="image-wrapper"
              >
                <img src={c.image} alt="comment" className="image-thumb" />
              </a>
            )}

            <div className="actions">
              <button
                className="reaction"
                onClick={() => handleLike(c.id)}
              >
                👍 {c.likes}
              </button>

              {editingId === c.id ? (
                <>
                  <button
                    className="btn primary small"
                    onClick={() => handleUpdate(c.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="icon edit"
                    title="Edit comment"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditingText(c.text);
                    }}
                  >
                    ✎ Edit
                  </button>

                  <button
                    className="icon danger"
                    title="Delete comment"
                    onClick={() => handleDelete(c.id)}
                  >
                    🗑 Delete
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;
